(function() {
    // Avoid double injection
    if (document.getElementById('ai-copilot-container')) return;

    // Load FontAwesome or Bootstrap Icons if not already present
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const biLink = document.createElement('link');
        biLink.rel = 'stylesheet';
        biLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        document.head.appendChild(biLink);
    }

    // Insert Chat CSS Link
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'copilot.css';
    document.head.appendChild(styleLink);

    // Create Chat Widget HTML Structure
    const container = document.createElement('div');
    container.id = 'ai-copilot-container';
    container.innerHTML = `
        <!-- Floating Toggle Button -->
        <button id="ai-copilot-toggle" class="btn btn-primary" title="Ask AI Copilot">
            <i class="bi bi-robot"></i>
            <span class="pulse-ring"></span>
        </button>

        <!-- Chat Window -->
        <div id="ai-copilot-window" class="chat-window-hidden">
            <div class="chat-header">
                <div class="chat-header-title">
                    <i class="bi bi-cpu-fill"></i>
                    <div>
                        <strong>AI Study Copilot</strong>
                        <span class="chat-status"><span class="status-dot"></span>Online Tutor</span>
                    </div>
                </div>
                <button id="ai-copilot-close" class="btn-close btn-close-white" aria-label="Close"></button>
            </div>
            <div class="chat-messages" id="ai-copilot-messages">
                <!-- Messages will appear here -->
            </div>
            <div class="chat-input-area">
                <input type="text" id="ai-copilot-input" placeholder="Ask a question about your studies..." />
                <button id="ai-copilot-send" class="btn btn-send">
                    <i class="bi bi-send-fill"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // DOM Elements
    const toggleBtn = document.getElementById('ai-copilot-toggle');
    const closeBtn = document.getElementById('ai-copilot-close');
    const chatWindow = document.getElementById('ai-copilot-window');
    const messagesContainer = document.getElementById('ai-copilot-messages');
    const inputField = document.getElementById('ai-copilot-input');
    const sendBtn = document.getElementById('ai-copilot-send');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? 'http://localhost:5000'
        : window.location.origin;
    let welcomeSent = false;

    // Toggle Chat Window
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('chat-window-hidden');
        chatWindow.classList.toggle('chat-window-visible');
        if (chatWindow.classList.contains('chat-window-visible')) {
            inputField.focus();
            if (!welcomeSent) {
                sendWelcomeMessage();
                welcomeSent = true;
            }
        }
    });

    // Close Chat Window
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('chat-window-visible');
        chatWindow.classList.add('chat-window-hidden');
    });

    // Send on Enter
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Send on Button Click
    sendBtn.addEventListener('click', sendMessage);

    // Get Student Info from localStorage
    function getStudentInfo() {
        const googleUserStr = localStorage.getItem('googleUser');
        let googleName = 'Learner';
        if (googleUserStr) {
            try {
                googleName = JSON.parse(googleUserStr).name || 'Learner';
            } catch (e) {}
        }
        const savedProfile = localStorage.getItem('learnerProfile');
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                return {
                    name: profile.fullName || googleName,
                    domain: profile.currentDomain || 'web-development'
                };
            } catch (e) {
                console.error('Error parsing learnerProfile:', e);
            }
        }
        return { name: googleName, domain: 'web-development' };
    }

    // Send Welcome Message
    function sendWelcomeMessage() {
        const student = getStudentInfo();
        const hourPref = localStorage.getItem('learnerProfile') ? JSON.parse(localStorage.getItem('learnerProfile')).weeklyStudyHours : 10;
        
        appendMessage('ai', `Hi **${student.name}**! 👋 I am your AI Study Copilot. \n\nI see you are focusing on **${formatDomainName(student.domain)}** and aiming for ${hourPref} hours of study this week. \n\nHow can I support your learning journey today? Try asking me: \n- *how to learn React?*\n- *recommend courses for Python*\n- *how to structure my study calendar*`);
    }

    // Send Message
    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        appendMessage('user', text);
        inputField.value = '';

        // Show typing indicator
        const typingId = showTypingIndicator();

        // Get Info
        const student = getStudentInfo();

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    userName: student.name,
                    userDomain: student.domain
                })
            });

            const result = await response.json();
            removeTypingIndicator(typingId);

            if (response.ok && result.response) {
                appendMessage('ai', result.response);
            } else {
                appendFallback(text);
            }
        } catch (error) {
            console.error('Network error communicating with AI Copilot:', error);
            removeTypingIndicator(typingId);
            appendFallback(text);
        }
    }

    // Fallback response generator (in case backend is offline)
    function appendFallback(text) {
        const query = text.toLowerCase();
        let reply = "";
        const student = getStudentInfo();

        if (query.includes('react')) {
            reply = `It looks like you want to learn React! ⚛️ Make sure you have a solid foundation in HTML, CSS, and modern JavaScript first. For React, focus on Props, State, Hooks, and Component lifecycle. The 'React - The Complete Guide' course is recommended!`;
        } else if (query.includes('javascript') || query.includes('js')) {
            reply = `JavaScript is the language of the web! 🌐 Practice array methods (map, filter, reduce), closures, promises, and async/await. Check out the 'Complete JavaScript Course 2024' in the suggested courses!`;
        } else if (query.includes('python')) {
            reply = `Python is perfect for scripting, data analysis, and AI! 🐍 Master basic data structures like lists, dicts, and tuple slicing. Then move onto Pandas/NumPy. Try starting with 'Python for Data Science'.`;
        } else if (query.includes('schedule') || query.includes('planner') || query.includes('hours')) {
            reply = `A good schedule breaks study sessions into bite-sized chunks! 📅 Check out the new **Study Planner** tool inside the **Demo Hub** to automatically distribute your weekly hours into a beautiful learning calendar.`;
        } else if (query.includes('job') || query.includes('career')) {
            reply = `Our project features direct job matching aligned with your learning pathway! 💼 Once your skills are assessed and you begin recommendations, you can view matched openings under the **Jobs & Certificate** section of the **Demo Hub**.`;
        } else {
            reply = `That is an interesting topic! 💡 Learning new tools is the best way to accelerate your career as a developer. I recommend setting aside at least 1.5 hours daily for hands-on practice. Let me know if you need specific course suggestions!`;
        }
        
        appendMessage('ai', reply + "\n\n*(Serving from offline backup - make sure your Flask backend is running on port 5000)*");
    }

    // Helper: format domain slug to readable text
    function formatDomainName(slug) {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Helper: parse simple markdown to html
    function parseMarkdown(text) {
        // Escape HTML
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Newlines
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    // Append Message to UI
    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender === 'user' ? 'message-user' : 'message-ai'}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = parseMarkdown(text);
        
        msgDiv.appendChild(bubble);
        messagesContainer.appendChild(msgDiv);
        
        // Auto scroll
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Typing Indicator
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-message message-ai typing-indicator-container';
        indicatorDiv.id = id;
        
        indicatorDiv.innerHTML = `
            <div class="message-bubble typing-bubble">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        messagesContainer.appendChild(indicatorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Navbar Authentication UI Manager
    function updateNavbarAuth() {
        const userId = localStorage.getItem('userId');
        const googleUserStr = localStorage.getItem('googleUser');
        const navContainer = document.querySelector('.navbar-nav');
        
        if (!navContainer) return;
        
        // Find profile link
        const profileLink = Array.from(navContainer.querySelectorAll('.nav-link'))
            .find(link => link.getAttribute('href') === 'profile.html');
            
        if (userId && googleUserStr) {
            try {
                const googleUser = JSON.parse(googleUserStr);
                
                // Show all links
                navContainer.querySelectorAll('.nav-item').forEach(li => {
                    li.style.display = '';
                });
                
                // If profile link exists, update it to show Google Avatar + Name
                if (profileLink) {
                    const avatarUrl = googleUser.picture || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
                    profileLink.innerHTML = `
                        <img src="${avatarUrl}" class="rounded-circle auth-nav-avatar" style="width: 24px; height: 24px; object-fit: cover; border: 1.5px solid var(--primary-light); margin-right: 6px; vertical-align: sub;">
                        <span class="auth-nav-name" style="font-weight: 600;">${googleUser.name.split(' ')[0]}</span>
                    `;
                }
                
                // Check if Log Out link already exists, if not, add it
                let logoutLink = document.getElementById('auth-logout-item');
                if (!logoutLink) {
                    const logoutLi = document.createElement('li');
                    logoutLi.className = 'nav-item';
                    logoutLi.id = 'auth-logout-item';
                    logoutLi.innerHTML = `
                        <a class="nav-link text-danger" href="#" id="auth-logout-btn" style="color: #ef4444 !important;">
                            <i class="bi bi-box-arrow-right"></i> Log Out
                        </a>
                    `;
                    navContainer.appendChild(logoutLi);
                    
                    // Bind Logout event
                    document.getElementById('auth-logout-btn').addEventListener('click', (e) => {
                        e.preventDefault();
                        logoutUser();
                    });
                }
            } catch (e) {
                console.error("Error setting auth navbar UI:", e);
            }
        } else {
            // Logged out state: update Profile link to say "Login" with Google Icon
            if (profileLink) {
                profileLink.innerHTML = `<i class="bi bi-google" style="font-size: 0.9rem; margin-right: 5px; color: var(--primary-light);"></i> Login`;
            }
            
            // Remove Log Out link if exists
            const logoutLink = document.getElementById('auth-logout-item');
            if (logoutLink) {
                logoutLink.remove();
            }

            // Hide other links when not logged in
            navContainer.querySelectorAll('.nav-item').forEach(li => {
                const a = li.querySelector('.nav-link');
                if (a && a.getAttribute('href') !== 'profile.html') {
                    li.style.display = 'none';
                } else {
                    li.style.display = '';
                }
            });
        }
    }
    
    function logoutUser() {
        localStorage.removeItem('userId');
        localStorage.removeItem('googleUser');
        localStorage.removeItem('learnerProfile');
        window.location.href = 'profile.html';
    }
    
    // Run on DOM load / execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateNavbarAuth);
    } else {
        updateNavbarAuth();
    }
    
    // Expose update function to other scripts if needed
    window.updateNavbarAuth = updateNavbarAuth;
})();
