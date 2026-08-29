import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { askCropAdvisor, isGeminiConfigured } from '../services/geminiService';
import type { AIRecommendation, CropType, Language } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAdvisorProps {
  crop: CropType;
  quantity: number;
  district: string;
  currentPrice: number;
  recommendation: AIRecommendation;
  language?: Language;
}

const SUGGESTED_QUESTIONS_EN = [
  'Should I sell my crop now or wait?',
  'Which buyer offers the best deal after transport costs?',
  'Is storing my produce in a warehouse worth it?',
];

const SUGGESTED_QUESTIONS_MR = [
  'माझा माल आता विकावा की थांबवावा?',
  'वाहतूक खर्च वजा करून कोणता खरेदीदार उत्तम दर देतो?',
  'गोदामात धान्य साठवणे परवडणारे आहे का?',
];

export function AIChatAdvisor({
  crop,
  quantity,
  district,
  currentPrice,
  recommendation,
  language = 'en',
}: AIChatAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatLang, setChatLang] = useState<'en' | 'mr' | 'hi'>(language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en');
  
  const getWelcomeMsg = (lang: 'en' | 'mr' | 'hi') => {
    if (lang === 'mr') {
      return `नमस्कार शेतकरी बंधूंनो! 🙏 मी फसलमित्र AI आहे, तुमचा कृषी बाजार सल्लागार. ${district} मधील तुमच्या ${crop} पिकाचे बाजारभाव, खरेदीदार पर्याय आणि नफा मिळवण्याचे मार्ग विचारण्यासाठी मला काहीही विचारा!`;
    }
    if (lang === 'hi') {
      return `नमस्ते किसान भाई! 🙏 मैं फसलमित्र AI हूँ, आपका कृषि बाजार सलाहकार। ${district} में आपकी ${crop} की फसल के लिए मंडी भाव और खरीदार के सुझाव पूछें!`;
    }
    return `Namaste! 🙏 I'm FasalMitr AI, your agricultural market advisor. I can help you understand market prices, buyer recommendations, and selling strategies for your ${crop} lot in ${district}. Ask me anything!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMsg(chatLang),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (text?: string) => {
    const question = text || inputValue.trim();
    if (!question || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askCropAdvisor(question, {
        crop,
        quantity,
        district,
        currentPrice,
        recommendation,
        language: chatLang,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: chatLang === 'mr' ? 'क्षमस्व, एरर आला आहे. कृपया पुन्हा प्रयत्न करा.' : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full p-4 shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 group cursor-pointer"
        title="Ask FasalMitr AI (मराठी/EN)"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <span className="absolute -top-10 right-0 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Ask FasalMitr AI (मराठी)
        </span>
      </button>
    );
  }

  const suggestedQuestions = chatLang === 'mr' ? SUGGESTED_QUESTIONS_MR : SUGGESTED_QUESTIONS_EN;

  return (
    <div
      className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-72 h-14'
          : 'bottom-6 right-6 w-[400px] h-[560px] max-h-[80vh]'
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">FasalMitr AI</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-md font-medium">मराठी/EN</span>
            </div>
            {!isMinimized && (
              <span className="text-emerald-100 text-[11px] block">
                {isGeminiConfigured() ? '● Gemini Powered' : '● AI Market Assistant'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Chat Language Selector */}
          {!isMinimized && (
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 mr-1 text-[11px]">
              <button
                onClick={() => setChatLang('mr')}
                className={`px-1.5 py-0.5 rounded-md transition cursor-pointer font-bold ${chatLang === 'mr' ? 'bg-white text-emerald-900 shadow-xs' : 'text-white/80 hover:text-white'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setChatLang('en')}
                className={`px-1.5 py-0.5 rounded-md transition cursor-pointer font-bold ${chatLang === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-white/80 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-stone-100 text-stone-800 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-stone-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="bg-stone-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (show only on first message) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-xs text-stone-500 mb-1.5">
                {chatLang === 'mr' ? 'सुचवलेले प्रश्न:' : 'Quick questions:'}
              </p>
              <div className="flex flex-col gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs text-left px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition cursor-pointer border border-emerald-200 truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-3 py-3 border-t border-stone-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatLang === 'mr' ? 'मराठीत विचारा (दर, खरेदीदार, नफा)...' : 'Ask in English or Marathi...'}
                className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-stone-400"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
