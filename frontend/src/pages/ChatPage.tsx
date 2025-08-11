import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { mastraClient } from '../lib/mastra';
import { ChatMessage } from '../types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAssistantIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SSE数据解析函数
  const parseSSEData = (data: string) => {
    const lines = data.split('\n');
    const result = {
      messageId: null as string | null,
      textContent: '',
      isFinished: false,
      finishReason: null as string | null,
      usage: null as any
    };

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      try {
        if (line.startsWith('f:')) {
          const metaData = JSON.parse(line.substring(2));
          if (metaData.messageId) {
            result.messageId = metaData.messageId;
          }
        }
        else if (line.startsWith('0:')) {
          const textPart = line.substring(2);
          const cleanText = textPart.replace(/^"(.*)"$/, '$1');
          result.textContent += cleanText;
        }
        else if (line.startsWith('e:')) {
          const endData = JSON.parse(line.substring(2));
          result.isFinished = true;
          result.finishReason = endData.finishReason;
          result.usage = endData.usage;
        }
        else if (line.startsWith('d:')) {
          const doneData = JSON.parse(line.substring(2));
          result.isFinished = true;
          result.finishReason = doneData.finishReason;
          result.usage = doneData.usage;
        }
      } catch (error) {
        console.warn('解析SSE数据行时出错:', line, error);
      }
    }

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const agent = mastraClient.getAgent('fortuneTellingAgent');
      const response = await agent.stream({
        messages: [{ role: 'user', content: inputValue }]
      });

      const assistantId = `assistant-${Date.now()}`;
      currentAssistantIdRef.current = assistantId;
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      response.processDataStream({
        onTextPart: (rawData: string) => {
          try {
            const parsedData = parseSSEData(rawData);
            
            if (parsedData.textContent && currentAssistantIdRef.current) {
              setMessages(prev => prev.map(m => m.id === currentAssistantIdRef.current
                ? { ...m, content: m.content + parsedData.textContent }
                : m
              ));
            }
            
            if (parsedData.isFinished) {
              setIsLoading(false);
            }
          } catch (error) {
            console.error('处理SSE数据时出错:', error);
            if (currentAssistantIdRef.current && typeof rawData === 'string') {
              const lines = rawData.split('\n');
              let textContent = '';
              
              for (const line of lines) {
                if (line.startsWith('0:')) {
                  const textPart = line.substring(2).replace(/^"(.*)"$/, '$1');
                  textContent += textPart;
                }
              }
              
              if (textContent) {
                setMessages(prev => prev.map(m => m.id === currentAssistantIdRef.current
                  ? { ...m, content: m.content + textContent }
                  : m
                ));
              }
            }
          }
        },
        onError: (error: any) => {
          console.error('数据流处理错误:', error);
          setIsLoading(false);
        },
        onComplete: () => {
          setIsLoading(false);
          currentAssistantIdRef.current = null;
        }
      });

    } catch (error) {
      console.error('请求失败:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，算命师暂时无法连接到神秘力量，请稍后再试...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    '我的爱情运势如何？',
    '最近的工作运怎么样？',
    '我适合什么颜色的房间？',
    '帮我起个好听的名字',
    '给我一个人生智慧'
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI算命师对话
          </h1>
          <p className="text-gray-400">
            与智慧的AI算命师交流，探索命运的奥秘
          </p>
        </motion.div>

        {/* 聊天容器 */}
        <div className="mystic-card min-h-[600px] flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🔮</div>
                <p className="text-xl mb-4 text-purple-300">欢迎来到天机阁</p>
                <p className="text-gray-400 mb-8">请提出您想了解的问题，算命师将为您答疑解惑</p>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-4">快速开始：</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-purple-500/30 text-purple-100'
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-purple-500/30 text-purple-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="animate-spin" size={16} />
                        <span className="text-sm">算命师正在施法中...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-purple-500/30 p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="请输入您的问题..."
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="fortune-button flex items-center space-x-2"
              >
                {isLoading ? (
                  <Sparkles className="animate-spin" size={16} />
                ) : (
                  <Send size={16} />
                )}
                <span>{isLoading ? '施法中' : '发送'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}