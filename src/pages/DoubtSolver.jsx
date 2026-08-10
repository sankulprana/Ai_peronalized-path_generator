import { useState, useRef, useEffect } from "react";
import { usePageHeader } from "../context/HeaderContext";
import { doubtSolverData } from "../data/dummyData";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { api } from "../services/api";

export default function DoubtSolver() {
  usePageHeader({
    pageTitle: "Doubt Solver",
    goalLabel: "Backend Developer",
  });

  const [messages, setMessages] = useState(doubtSolverData.initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const res = await api.ai.askDoubt(query, "Backend Developer");
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: res.answer || "I couldn't process that question right now.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn("Backend AI solver error, using client fallback:", err.message);
      const fallbackText =
        doubtSolverData.presetAnswers[query] ||
        `Great question about **${query}**!\n\nIn learning paths, this topic is crucial for building resilient systems. Keep diving deeper into best practices and practical implementation! 🚀`;

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: fallbackText,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header section */}
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100/80 text-violet-600">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {doubtSolverData.title}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-medium text-gray-500">
              {doubtSolverData.status}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {doubtSolverData.suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="rounded-full bg-gray-100/80 hover:bg-violet-50 hover:text-violet-700 text-gray-600 px-4 py-2 text-xs font-medium transition-all hover:border-violet-200 border border-transparent active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-purple-100 text-violet-600"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-3xl p-4 sm:p-5 text-sm max-w-2xl leading-relaxed ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white rounded-tr-none shadow-xs"
                  : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-violet-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-3xl rounded-tl-none bg-white border border-gray-100 px-5 py-3 shadow-xs flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
              AI Assistant is generating response...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form at bottom */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-auto relative"
      >
        <div className="flex items-center gap-2 rounded-full bg-gray-100/90 p-1.5 pl-5 border border-transparent focus-within:border-violet-300 focus-within:bg-white transition-all shadow-xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about your learning path..."
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 py-2"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-all hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
