import React, { useState, useEffect, useRef } from 'react';

function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  // Scroll to bottom whenever messages list updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Read student info from local storage
  const getStudentInfo = () => {
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
  };

  const formatDomainName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Trigger welcome message on toggle
  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    
    if (nextOpen && messages.length === 0) {
      const student = getStudentInfo();
      let hourPref = 10;
      try {
        const savedProfile = localStorage.getItem('learnerProfile');
        if (savedProfile) {
          hourPref = JSON.parse(savedProfile).weeklyStudyHours || 10;
        }
      } catch (e) {}
      
      const welcomeText = `Hi **${student.name}**! 👋 I am your AI Study Copilot. \n\nI see you are focusing on **${formatDomainName(student.domain)}** and aiming for ${hourPref} hours of study this week. \n\nHow can I support your learning journey today? Try asking me: \n- *how to learn React?*\n- *recommend courses for Python*\n- *how to structure my study calendar*`;
      
      setMessages([{ sender: 'ai', text: welcomeText }]);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    const student = getStudentInfo();
    
    // Retrieve achievements for context
    const achievementsStr = localStorage.getItem('achievements');
    let xp = 0;
    let streak = 0;
    if (achievementsStr) {
      try {
        const ach = JSON.parse(achievementsStr);
        xp = ach.xp || 0;
        streak = ach.streak || 0;
      } catch (e) {}
    }

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          userName: student.name,
          userDomain: student.domain,
          xp: xp,
          streak: streak
        })
      });

      const result = await response.json();
      setIsTyping(false);

      if (response.ok && result.response) {
        setMessages(prev => [...prev, { sender: 'ai', text: result.response }]);
      } else {
        appendFallback(text);
      }
    } catch (error) {
      console.error('Network error communicating with AI Copilot:', error);
      setIsTyping(false);
      appendFallback(text);
    }
  };

  const appendFallback = (text) => {
    const query = text.toLowerCase();
    let reply = "";

    const achievementsStr = localStorage.getItem('achievements');
    let xp = 0;
    let streak = 0;
    if (achievementsStr) {
      try {
        const ach = JSON.parse(achievementsStr);
        xp = ach.xp || 0;
        streak = ach.streak || 0;
      } catch (e) {}
    }
    const level = Math.floor(xp / 100) + 1;

    if (query.includes('progress') || query.includes('status') || query.includes('xp') || query.includes('streak') || query.includes('level')) {
      reply = `Here is your current progression summary:\n🔥 **Streak**: ${streak} days\n⚡ **Experience**: ${xp} XP\n🏆 **Level**: Level ${level}\n\nYou're doing amazing! Complete more quizzes and coding challenges to level up!`;
    } else if (query.includes('react')) {
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

    const fallbackResponse = reply + "\n\n*(Serving from offline backup - make sure your Flask backend is running on port 5000)*";
    setMessages(prev => [...prev, { sender: 'ai', text: fallbackResponse }]);
  };

  const parseMarkdown = (text) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Newlines to <br>
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  return (
    <div id="ai-copilot-container">
      {/* Floating Toggle Button */}
      <button 
        id="ai-copilot-toggle" 
        onClick={handleToggle} 
        title="Ask AI Copilot"
        style={{ zIndex: 1060 }}
      >
        <i className={isOpen ? "bi bi-x-lg" : "bi bi-robot"}></i>
        {!isOpen && <span className="pulse-ring"></span>}
      </button>

      {/* Chat Window */}
      <div 
        id="ai-copilot-window" 
        className={isOpen ? "chat-window-visible" : "chat-window-hidden"}
      >
        <div className="chat-header">
          <div className="chat-header-title">
            <i className="bi bi-cpu-fill"></i>
            <div>
              <strong>AI Study Copilot</strong>
              <span className="chat-status">
                <span className="status-dot"></span>Online Tutor
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setIsOpen(false)} 
            aria-label="Close"
          ></button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}>
              <div 
                className="message-bubble"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
              />
            </div>
          ))}
          {isTyping && (
            <div className="chat-message message-ai">
              <div className="message-bubble typing-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about your studies..." 
            autoComplete="off"
          />
          <button type="submit" className="btn btn-send">
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AICopilot;
