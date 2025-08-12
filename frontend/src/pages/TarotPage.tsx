import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { TarotSpread, TarotReading, ApiResponse } from '../types';

const TarotPage = () => {
  const [spreads, setSpreads] = useState<TarotSpread[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<string>('three-card');
  const [question, setQuestion] = useState<string>('');
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCards, setShowCards] = useState<boolean>(false);

  // 获取牌阵类型
  useEffect(() => {
    const fetchSpreads = async () => {
      try {
        const response = await api.tarot.getSpreads();
        if (response.success && response.data) {
          setSpreads(response.data);
        }
      } catch (error) {
        console.error('获取牌阵失败:', error);
      }
    };

    fetchSpreads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('请输入您的问题');
      return;
    }

    setLoading(true);
    setError(null);
    setShowCards(false);

    try {
      const response = await api.tarot.performReading({
        spreadType: selectedSpread,
        question: question.trim(),
      });

      if (response.success && response.data) {
        setReading(response.data);
        setTimeout(() => setShowCards(true), 1000);
      } else {
        setError(response.error || '占卜失败，请重试');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const resetReading = () => {
    setReading(null);
    setShowCards(false);
    setQuestion('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 神秘背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block text-6xl mb-4">🃏</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4">
            塔罗占卜
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            让神秘的塔罗牌为您指引人生方向，解答内心疑惑
          </p>
        </motion.div>

        {!reading ? (
          /* 占卜表单 */
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 牌阵选择 */}
                <div>
                  <label className="block text-lg font-medium text-white mb-4">
                    选择牌阵
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {spreads.map((spread) => (
                      <motion.button
                        key={spread.id}
                        type="button"
                        onClick={() => setSelectedSpread(spread.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedSpread === spread.id
                            ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                            : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h3 className="font-semibold text-white mb-2">{spread.name}</h3>
                        <p className="text-gray-300 text-sm">{spread.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 问题输入 */}
                <div>
                  <label htmlFor="question" className="block text-lg font-medium text-white mb-4">
                    您的问题
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="请详细描述您想要了解的问题..."
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none backdrop-blur-sm"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-400 text-sm">
                      提示：问题越具体，占卜结果越准确
                    </p>
                    <p className="text-gray-400 text-sm">
                      {question.length}/500
                    </p>
                  </div>
                </div>

                {/* 错误提示 */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl text-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 提交按钮 */}
                <motion.button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
                  whileHover={!loading ? { y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      正在为您占卜...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🔮</span>
                      开始占卜
                      <span>✨</span>
                    </div>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* 占卜结果 */
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* 问题回顾 */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">您的问题</h2>
              <p className="text-xl text-purple-300 italic">"{reading.question}"</p>
              <p className="text-gray-400 mt-2">牌阵：{reading.spreadType}</p>
            </motion.div>

            {/* 塔罗牌展示 */}
            <div className="mb-12">
              <div className={`grid gap-8 ${
                reading.cards.length === 1 
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : reading.cards.length <= 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {reading.cards.map((card, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 50, rotateY: 180 }}
                    animate={showCards ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {/* 卡牌 */}
                    <div className={`relative mb-4 ${card.isReversed ? 'transform rotate-180' : ''}`}>
                      <div className="w-32 h-48 mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-2xl border-2 border-gold-400 flex items-center justify-center text-4xl backdrop-blur-sm">
                        🃏
                      </div>
                      {card.isReversed && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          R
                        </div>
                      )}
                    </div>
                    
                    {/* 卡牌信息 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h3 className="font-bold text-purple-300 mb-1">{card.position}</h3>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {card.card}
                        {card.isReversed && <span className="text-red-400 ml-2">(逆位)</span>}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {card.interpretation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 详细解读 */}
            <AnimatePresence>
              {showCards && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
                >
                  <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
                    🔮 塔罗师解读
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {reading.interpretation}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 操作按钮 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button
                onClick={resetReading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span>🔄</span>
                重新占卜
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TarotPage;
