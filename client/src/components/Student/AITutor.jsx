import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Brain, User, Mic, Image, FileText, Copy, ThumbsUp, ThumbsDown, MicOff, X, ChevronDown, ChevronUp, Sparkles, Zap, BookOpen, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { studentAPI } from '../../services/api';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import './AITutor.css';

const AITutor = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'ai',
    content: t('aiTutorWelcome'),
    timestamp: new Date().toISOString(),
    reactions: {}
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('gradient');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const newSocket = io("/tutor", {
      auth: { token }
    });

    newSocket.on("connect", () => console.log("Connected to AI Tutor Socket"));

    newSocket.on("ai_response", (data) => {
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: data.response,
        timestamp: new Date().toISOString(),
        reactions: {}
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const MESSAGES_PER_PAGE = 50;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await studentAPI.getAIChatHistory();
        if (response.data.data && response.data.data.length > 0) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load chat history');
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const paginatedMessages = useMemo(() => {
    const startIndex = Math.max(0, messages.length - (currentPage + 1) * MESSAGES_PER_PAGE);
    return messages.slice(startIndex);
  }, [messages, currentPage]);

  const handleSendMessage = async (e, messageContent = inputMessage, files = uploadedFiles) => {
    e?.preventDefault();
    if ((!messageContent.trim() && files.length === 0) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          socket.emit("user_message", {
            type: file.type.includes("image") ? "image" : "pdf",
            file: reader.result,
            message: messageContent
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        socket.emit("user_message", {
          type: "text",
          message: messageContent
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        transcribeAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      const response = await studentAPI.transcribeAudio(formData);
      setInputMessage(prev => prev + ' ' + response.data.text);
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Voice input feature is not available');
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied!');
  };

  const reactToMessage = (messageId, reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const loadMoreMessages = () => {
    setCurrentPage(prev => prev + 1);
  };

  const quickQuestions = [
    "Explain photosynthesis",
    "Help with algebra equations",
    "What is Newton's first law?",
    "Explain the water cycle",
    "Help with essay writing",
    "Solve quadratic equations"
  ];

  return (
    <div className={`h-full flex flex-col rounded-2xl border relative transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } bg-[#0a0f1c] text-slate-200 border-indigo-500/20 overflow-hidden font-sans`}>
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-indigo-500/20 bg-slate-900/60 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Brain className="text-white" size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-bounce">
              <Sparkles className="text-white" size={8} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Tutor</h1>
              <Zap className="text-yellow-500 animate-pulse" size={16} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <BookOpen size={12} />
              <span>Your intelligent learning companion</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs font-medium text-green-400">Online</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme(theme === 'gradient' ? 'minimal' : 'gradient');
            }}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            title="Toggle theme"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth relative z-10"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length > MESSAGES_PER_PAGE && currentPage === 0 && (
          <button
            onClick={loadMoreMessages}
            className="w-full p-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center space-x-2"
            aria-label="Load more messages"
          >
            <ChevronUp size={16} />
            <span>Load more messages</span>
          </button>
        )}

        {paginatedMessages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
            role="article"
            aria-label={`${message.type === 'user' ? 'Your' : 'AI'} message`}
          >
            <div className={`flex items-start space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-110 ${message.type === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/30'
                  : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-gradient-x shadow-purple-500/30'
                }`}>
                {message.type === 'user' ? (
                  <User className="text-white" size={18} />
                ) : (
                  <Brain className="text-white" size={18} />
                )}
              </div>
              <div className={`rounded-2xl p-5 group relative shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl ${message.type === 'user'
                  ? 'bg-indigo-600/90 text-white border border-indigo-500/50 rounded-tr-sm'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                }`}>
                <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert">
                  <div dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/### (.*?)\n/g, '<h5 class="text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">$1</h5>')
                      .replace(/## (.*?)\n/g, '<h4 class="text-lg font-bold mb-2 mt-3 text-blue-600 dark:text-blue-400">$1</h4>')
                      .replace(/# (.*?)\n/g, '<h3 class="text-xl font-bold mb-3 mt-4 text-purple-600 dark:text-purple-400">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-700 dark:text-purple-300">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')
                      .replace(/`(.*?)`/g, '<code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>')
                      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3"><code>$1</code></pre>')
                      .replace(/^- (.*?)$/gm, '<li class="ml-4 mb-1">• $1</li>')
                      .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n/g, '<br/>')
                  }}
                  />
                </div>

                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.files.map((file, idx) => (
                      <div key={idx} className="text-xs opacity-75 flex items-center space-x-1">
                        {file.type.startsWith('image/') ? <Image size={12} /> : <FileText size={12} />}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${message.type === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${message.type === 'user'
                          ? 'text-indigo-200 hover:text-white hover:bg-white/20'
                          : 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/20'
                        }`}
                      title="Copy message"
                      aria-label="Copy message"
                    >
                      <Copy size={14} />
                    </button>
                    {message.type === 'ai' && (
                      <>
                        <button
                          onClick={() => reactToMessage(message.id, 'like')}
                          className="p-2 rounded-lg text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-110"
                          title="Like message"
                          aria-label="Like message"
                        >
                          <ThumbsUp size={14} />
                          {message.reactions?.like > 0 && <span className="ml-1 text-xs font-medium">{message.reactions.like}</span>}
                        </button>
                        <button
                          onClick={() => reactToMessage(message.id, 'dislike')}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                          title="Dislike message"
                          aria-label="Dislike message"
                        >
                          <ThumbsDown size={14} />
                          {message.reactions?.dislike > 0 && <span className="ml-1 text-xs font-medium">{message.reactions.dislike}</span>}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(isLoading || isTyping) && (
          <div className="flex justify-start animate-fade-in relative z-10">
            <div className="flex items-start space-x-3 max-w-4xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                <Brain className="text-white" size={18} />
              </div>
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-700/50">
                {isTyping ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-400 animate-pulse">AI is thinking...</span>
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-32 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 transition-colors z-20"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 relative z-10">
          <p className="text-sm text-slate-400 mb-3 font-medium">Quick questions to get started:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-left p-3 flex items-center gap-2 bg-slate-800/60 rounded-xl hover:bg-slate-700/60 border border-slate-700/50 transition-all duration-300 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:shadow-lg hover:-translate-y-0.5"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setInputMessage(question);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Quick question: ${question}`}
              >
                <Sparkles size={14} className="text-indigo-400" />
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-indigo-500/20 bg-slate-900/60 backdrop-blur-md relative z-10">
        {uploadedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-700/50 animate-fade-in hover:shadow-xl transition-all duration-300">
                <div className={`p-2 rounded-lg ${file.type.startsWith('image/')
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                  {file.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-300 truncate block max-w-32">{file.name}</span>
                  <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 hover:scale-110"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 ${isRecording
                    ? 'bg-rose-500 text-white focus:ring-rose-500 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-800 text-slate-300 hover:text-indigo-400 focus:ring-indigo-500 border border-slate-700 hover:border-indigo-500/50'
                  }`}
                title={isRecording ? 'Stop recording' : 'Voice input'}
                aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 border border-slate-700 hover:border-green-500/50"
                title="Upload image"
                aria-label="Upload image"
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 border border-slate-700 hover:border-indigo-500/50"
                title="Upload document"
                aria-label="Upload document"
              >
                <FileText size={20} />
              </button>
            </div>
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything... I'm here to help you learn! 🎓"
                className="w-full p-4 pr-12 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 bg-slate-800/80 backdrop-blur-md text-white resize-none shadow-lg transition-all duration-300"
                rows="3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                aria-label="Type your message"
              />
              {inputMessage && (
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {inputMessage.length}/1000
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
            className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:shadow-none hover:-translate-y-0.5"
            aria-label="Send message"
          >
            <Send size={24} className={isLoading ? 'animate-pulse text-indigo-200' : ''} />
          </button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={(e) => handleFileUpload(e, 'document')}
          className="hidden"
          aria-label="File upload input"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'image')}
          className="hidden"
          aria-label="Image upload input"
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-500 flex items-center space-x-2">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <div className="flex items-center space-x-1 border border-indigo-500/20 px-2 py-1 rounded bg-indigo-500/5">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;