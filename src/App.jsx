import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, PlusCircle, Menu, Activity, X, Settings } from 'lucide-react';

const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ isLoading: false, status: null });
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const HEALTH_URL = import.meta.env.VITE_HEALTH_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkServerHealth = async () => {
    setHealthStatus({ isLoading: true, status: null });
    try {
      const response = await fetch(HEALTH_URL);
      const data = await response.json();
      setHealthStatus({ 
        isLoading: false, 
        status: data.status === 'success' ? 'healthy' : 'unhealthy' 
      });
      
      setTimeout(() => {
        setHealthStatus(prev => ({ ...prev, status: null }));
      }, 3000);
    } catch (error) {
      setHealthStatus({ isLoading: false, status: 'unhealthy' });
      setTimeout(() => {
        setHealthStatus(prev => ({ ...prev, status: null }));
      }, 3000);
    }
  };

  const handleNewChat = () => {
    setMessages([{ role: 'assistant', text: 'Hello! How can I help you today?' }]);
    setInputMessage('');
    setIsTyping(false);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInputMessage('');
    setIsTyping(true);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: userMessage }),
      });

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botResponse = '';

      setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const words = chunk.split(' ');

        words.forEach((word) => {
          if (word.trim()) {
            botResponse += `${word} `;
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.role === 'assistant') {
                lastMessage.text = botResponse.trim();
                return [...prev.slice(0, prev.length - 1), lastMessage];
              }
              return prev;
            });
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getHealthStatusClasses = () => {
    if (healthStatus.isLoading) return 'bg-yellow-600';
    if (healthStatus.status === 'healthy') return 'bg-green-600';
    if (healthStatus.status === 'unhealthy') return 'bg-red-600';
    return 'bg-gray-700';
  };

  return (
    <div className="relative flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-gray-800 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top section */}
        <div className="flex-none p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-3 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              <PlusCircle size={20} />
              <span className="font-medium">New Chat</span>
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-2 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Middle section with health check */}
        <div className="flex-none p-4 border-b border-gray-700">
          <button
            onClick={checkServerHealth}
            disabled={healthStatus.isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all duration-300 ${getHealthStatusClasses()} hover:opacity-90 disabled:opacity-50`}
          >
            <Activity size={18} className={healthStatus.isLoading ? 'animate-spin' : ''} />
            <span className="text-sm">
              {healthStatus.isLoading ? 'Checking...' : 
               healthStatus.status === 'healthy' ? 'Server Healthy ✅' :
               healthStatus.status === 'unhealthy' ? 'Server Error ❌' :
               'Check Server'}
            </span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-white truncate">Chat with Assistant</h1>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fadeIn`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] sm:max-w-2xl px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-gray-700 text-gray-200 mr-12'
                } shadow-lg`}
              >
                {message.text}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 pl-12">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <footer className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-4 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-5 h-5 ${inputMessage.trim() ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;