import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, MessageCircle, Wand2, Moon, Stars } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import { mastraClient } from '../lib/mastra';
import { ChatMessage } from '../types';

// Markdown组件的自定义样式
const MarkdownComponents: Components = {
  // 自定义段落样式
  p: ({ children }) => (
    <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
  ),
  // 自定义标题样式
  h1: ({ children }) => (
    <h1 className="mb-2 text-lg font-bold text-purple-200">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 text-base font-bold text-purple-200">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 text-sm font-bold text-purple-200">{children}</h3>
  ),
  // 自定义列表样式
  ul: ({ children }) => (
    <ul className="mb-2 ml-4 space-y-1 list-disc list-outside">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 ml-4 space-y-1 list-decimal list-outside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  // 自定义强调样式
  strong: ({ children }) => (
    <strong className="font-bold text-purple-200">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-purple-300">{children}</em>
  ),
  // 自定义代码样式
  code: ({ inline, children, ...props }) => 
    inline ? (
      <code className="px-1 py-0.5 mx-1 text-xs bg-purple-800/50 rounded text-purple-200 font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className="block overflow-x-auto p-2 my-2 font-mono text-xs rounded border bg-black/30 border-purple-500/30" {...props}>
        {children}
      </code>
    ),
  // 自定义代码块样式
  pre: ({ children }) => (
    <pre className="overflow-x-auto p-3 my-2 rounded border bg-black/30 border-purple-500/30">
      {children}
    </pre>
  ),
  // 自定义引用样式
  blockquote: ({ children }) => (
    <blockquote className="pl-4 my-2 italic text-purple-300 border-l-4 border-purple-500/50">
      {children}
    </blockquote>
  ),
  // 自定义链接样式
  a: ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-300 underline transition-colors hover:text-purple-200"
    >
      {children}
    </a>
  ),
  // 自定义表格样式
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full rounded border border-purple-500/30">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1 text-xs font-bold text-purple-200 border bg-purple-800/30 border-purple-500/30">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1 text-xs border border-purple-500/30">
      {children}
    </td>
  ),
  // 自定义分割线样式
  hr: () => (
    <hr className="my-3 border-purple-500/30" />
  ),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentAssistantIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000); // 延长一点时间
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // 针对你的SSE格式优化的数据提取函数
  const extractTextFromSSE = useCallback((rawData: string): string => {
    console.log('=== Processing your SSE format ===');
    console.log('Raw data:', JSON.stringify(rawData));
    
    let extractedText = '';
    
    // 按行分割数据
    const lines = rawData.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      console.log('Processing line:', line);
      
      try {
        if (line.startsWith('f:')) {
          // 元数据行: f:{"messageId":"msg-xxx"}
          const metaData = JSON.parse(line.substring(2));
          console.log('Message metadata:', metaData);
          // 这里可以保存messageId如果需要的话
        }
        else if (line.startsWith('0:')) {
          // 文本内容行: 0:"Hello"
          const textPart = line.substring(2); // 移除 "0:"
          
          // 移除外层引号，如果存在的话
          let cleanText = textPart;
          if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
            cleanText = cleanText.slice(1, -1);
          }
          
          // 处理转义字符
          cleanText = cleanText
            .replace(/\\n/g, '\n')      // 换行符
            .replace(/\\t/g, '\t')      // 制表符
            .replace(/\\r/g, '\r')      // 回车符
            .replace(/\\"/g, '"')       // 引号
            .replace(/\\\\/g, '\\');    // 反斜杠
          
          console.log('Extracted text chunk:', JSON.stringify(cleanText));
          extractedText += cleanText;
        }
        else if (line.startsWith('e:')) {
          // 结束事件: e:{"finishReason":"stop","usage":{...}}
          const endData = JSON.parse(line.substring(2));
          console.log('End event:', endData);
          // 这里可以处理结束事件，如保存usage信息
        }
        else if (line.startsWith('d:')) {
          // 完成事件: d:{"finishReason":"stop","usage":{...}}
          const doneData = JSON.parse(line.substring(2));
          console.log('Done event:', doneData);
          // 标记流完成
        }
        else {
          // 其他格式的备用处理
          console.log('Unknown line format, trying as plain text:', line);
          if (line.trim() && !line.includes('{') && !line.includes('}')) {
            extractedText += line.trim();
          }
        }
      } catch (error) {
        console.warn('Error parsing line:', line, error);
        
        // 备用处理：如果是简单的文本，直接使用
        if (line.trim() && !line.includes(':') && !line.includes('{')) {
          extractedText += line.trim();
        }
      }
    }
    
    console.log('Final extracted text:', JSON.stringify(extractedText));
    console.log('Text length:', extractedText.length);
    console.log('=== End SSE Processing ===');
    
    return extractedText;
  }, []);

  // 更新消息内容的回调函数
  const updateAssistantMessage = useCallback((newText: string) => {
    if (!currentAssistantIdRef.current || !newText) return;
    
    console.log('Updating message with text:', newText);
    
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === currentAssistantIdRef.current) {
          const updatedContent = message.content + newText;
          console.log('Updated content:', updatedContent);
          return {
            ...message,
            content: updatedContent
          };
        }
        return message;
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // 使用局部变量保存assistantId
    const assistantId = `assistant-${Date.now()}`;
    currentAssistantIdRef.current = assistantId;
    
    console.log('Created assistant ID:', assistantId);

    try {
      const agent = mastraClient.getAgent('fortuneTellingAgent');
      const response = await agent.stream({
        messages: [{ role: 'user', content: inputValue }]
      });
      
      // 创建初始的助手消息
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      }]);

      console.log('Starting SSE stream processing for ID:', assistantId);

      // 直接更新消息的函数
      const appendToMessage = (textChunk: string) => {
        if (!textChunk) return;
        
        console.log('Appending text chunk:', JSON.stringify(textChunk));
        
        setMessages(prevMessages => {
          return prevMessages.map(message => {
            if (message.id === assistantId) {
              const newContent = message.content + textChunk;
              console.log('New message content length:', newContent.length);
              return {
                ...message,
                content: newContent
              };
            }
            return message;
          });
        });
        
        // 保持typing状态，表示正在接收数据
        setIsTyping(true);
      };

      response.processDataStream({
        onTextPart: (rawData: string) => {
          console.log('=== Received SSE chunk ===');
          console.log('Raw data:', rawData);
          console.log('currentAssistantIdRef.current:', currentAssistantIdRef.current);
          console.log('Local assistantId:', assistantId);
          
          try {
            // 使用改进的SSE数据提取函数
            const extractedText = extractTextFromSSE(rawData);
            
            if (extractedText) {
              console.log('Successfully extracted text:', extractedText);
              appendToMessage(extractedText);
            } else {
              console.log('No text extracted from this chunk');
              // 对于某些SSE格式，可能需要直接使用原始数据
              if (typeof rawData === 'string' && rawData.trim() && 
                  !rawData.includes('data:') && 
                  !rawData.includes('[DONE]') && 
                  !rawData.startsWith('{') && 
                  !rawData.endsWith('}')) {
                console.log('Using raw data as fallback text');
                appendToMessage(rawData.trim());
              }
            }
          } catch (error) {
            console.error('Error processing SSE chunk:', error);
            
            // 最终fallback：如果所有解析都失败，尝试直接使用原始数据
            if (typeof rawData === 'string' && rawData.trim()) {
              console.log('Emergency fallback: using raw data');
              // 清理一下明显的非文本内容
              const cleanData = rawData
                .replace(/^data:\s*/, '')
                .replace(/\[DONE\]/, '')
                .trim();
              
              if (cleanData && cleanData.length > 0) {
                appendToMessage(cleanData);
              }
            }
          }
          
          console.log('=== End SSE chunk processing ===');
        },
        
        onError: (error: any) => {
          console.error('SSE stream error:', error);
          setIsLoading(false);
          setIsTyping(false);
          currentAssistantIdRef.current = null;
          
          // 添加错误消息
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '抱歉，在处理您的请求时遇到了问题，请稍后再试。',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, errorMessage]);
        },
        
        onFinishMessagePart: () => {
          console.log('SSE stream finished');
          setIsLoading(false);
          setIsTyping(false);
          
          // 延迟清空ref，确保所有数据都处理完毕
          setTimeout(() => {
            currentAssistantIdRef.current = null;
            console.log('Cleared assistant ID ref');
          }, 100);
        }
      });

    } catch (error) {
      console.error('Request failed:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，算命师暂时无法连接到神秘力量，请稍后再试...',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsTyping(false);
      currentAssistantIdRef.current = null;
    }
  };

  const quickQuestions = [
    { text: '我的爱情运势如何？', icon: '💝', color: 'from-pink-500 to-rose-500' },
    { text: '最近的工作运怎么样？', icon: '💼', color: 'from-blue-500 to-indigo-500' },
    { text: '我适合什么颜色的房间？', icon: '🏠', color: 'from-green-500 to-emerald-500' },
    { text: '帮我起个好听的名字', icon: '📝', color: 'from-orange-500 to-amber-500' },
    { text: '给我一个人生智慧', icon: '🌾', color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="overflow-hidden relative px-4 py-8 min-h-screen">
      {/* 动态背景粒子 */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/30"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* 华丽的标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-block relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -left-4 w-8 h-8 text-purple-400"
            >
              <Stars size={32} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-8 h-8 text-pink-400"
            >
              <Sparkles size={32} />
            </motion.div>
            
            <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 md:text-5xl">
              AI算命师对话
            </h1>
          </div>
          <p className="mb-2 text-lg text-gray-400">
            与智慧的AI算命师交流，探索命运的奥秘
          </p>
          <div className="flex justify-center items-center space-x-2 text-sm text-purple-300">
            <span>神秘力量已就绪</span>
            <Moon size={16} />
          </div>
        </motion.div>

        {/* 聊天容器 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* 聊天框装饰边框 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl opacity-30 blur-sm"></div>
          
          <div className="overflow-hidden relative bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-xl from-slate-900/90 via-purple-900/50 to-slate-900/90 border-purple-500/30">
            {/* 装饰性顶部栏 */}
            <div className="px-6 py-3 bg-gradient-to-r border-b from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-300">天机阁算命师在线</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mb-6 text-6xl"
                    >
                      🔮
                    </motion.div>
                    <h3 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      欢迎来到天机阁
                    </h3>
                    <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-400">
                      请提出您想了解的问题，算命师将为您答疑解惑。让古老的智慧指引您的人生道路。
                    </p>
                    
                    <div className="space-y-3">
                      <p className="mb-4 text-sm font-medium text-purple-300">✨ 快速开始：</p>
                      <div className="grid grid-cols-1 gap-3 mx-auto max-w-2xl md:grid-cols-2">
                        {quickQuestions.map((question, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setInputValue(question.text)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 bg-gradient-to-r ${question.color} bg-opacity-20 hover:bg-opacity-30 border border-current border-opacity-30 rounded-xl text-white text-sm transition-all duration-300 backdrop-blur-sm group`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg transition-transform group-hover:scale-110">{question.icon}</span>
                              <span>{question.text}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative group ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-purple-500/30 text-purple-100 backdrop-blur-sm shadow-lg'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex absolute top-3 -left-3 justify-center items-center w-6 h-6 text-xs bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                            🔮
                          </div>
                        )}
                        
                        {/* 使用ReactMarkdown渲染消息内容 */}
                        <div className="text-sm leading-relaxed">
                          {message.role === 'assistant' ? (
                            <div className="relative">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                components={MarkdownComponents}
                              >
                                {message.content}
                              </ReactMarkdown>
                              {/* 简单的typing指示器 */}
                              {isTyping && message.id === currentAssistantIdRef.current && (
                                <span className="inline-block ml-1 w-2 h-4 bg-purple-400 animate-pulse"></span>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                        </div>
                        
                        <div className={`text-xs mt-2 opacity-70 flex items-center justify-between ${
                          message.role === 'user' ? 'text-purple-100' : 'text-purple-300'
                        }`}>
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.role === 'assistant' && (
                            <Wand2 size={12} className="opacity-50" />
                          )}
                        </div>
                        
                        {/* 消息装饰效果 */}
                        {message.role === 'assistant' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-3 text-purple-100 bg-gradient-to-r rounded-2xl border shadow-lg backdrop-blur-sm from-indigo-900/50 to-purple-900/50 border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={16} className="text-purple-400" />
                      </motion.div>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-sm">
                        {isTyping ? '算命师正在解读星象...' : '正在连接神秘力量...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-6 bg-gradient-to-r border-t backdrop-blur-sm border-purple-500/30 from-slate-900/50 to-purple-900/30">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="请输入您的问题... 让星辰为您指引方向"
                    className="px-6 py-4 pr-16 w-full text-white rounded-2xl border backdrop-blur-sm transition-all duration-300 bg-black/30 border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-300/70 group-hover:border-purple-400/50"
                    disabled={isLoading}
                  />
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex absolute right-2 top-1/2 justify-center items-center w-12 h-12 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg transition-all duration-300 transform -translate-y-1/2 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={20} />
                      </motion.div>
                    ) : (
                      <Send size={20} />
                    )}
                  </motion.button>
                </div>
                
                {/* 输入提示 */}
                <div className="flex justify-center items-center mt-3 space-x-4 text-xs text-purple-300/70">
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={12} />
                    <span>按 Enter 发送</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>AI智能解读</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}