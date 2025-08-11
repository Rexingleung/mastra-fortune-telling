import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Eye } from 'lucide-react';
import { TAROT_MAJOR_ARCANA } from '../lib/constants';
import { TarotCard } from '../types';

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [reading, setReading] = useState<string>('');
  const [spreadType, setSpreadType] = useState<'single' | 'three' | 'celtic'>('three');

  const shuffleCards = () => {
    const shuffled = [...TAROT_MAJOR_ARCANA]
      .sort(() => Math.random() - 0.5)
      .slice(0, spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 10)
      .map(card => ({
        ...card,
        id: `${card.id}-${Date.now()}`,
        suit: 'major' as const,
        isReversed: Math.random() > 0.7,
        meaning: card.meaning,
      }));
    
    setSelectedCards(shuffled);
    setReading('');
  };

  const performReading = async () => {
    if (selectedCards.length === 0) return;
    
    setIsReading(true);
    
    // 这里模拟AI解读，实际应该调用后端API
    setTimeout(() => {
      const cardNames = selectedCards.map(card => 
        `${card.nameCn}${card.isReversed ? '(逆位)' : ''}`
      ).join('、');
      
      setReading(`您抽到的牌是：${cardNames}\n\n根据塔罗牌的指引，您当前的状况显示...\n\n[这里应该是AI生成的详细解读]`);
      setIsReading(false);
    }, 2000);
  };

  const spreadTypes = [
    { id: 'single', name: '单牌占卜', description: '简单直接的问题解答' },
    { id: 'three', name: '三牌阵', description: '过去、现在、未来' },
    { id: 'celtic', name: '凯尔特十字', description: '全面深入的人生解读' }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            塔罗牌占卜 🎴
          </h1>
          <p className="text-gray-400 text-lg">
            让古老的塔罗牌为您揭示命运的秘密
          </p>
        </motion.div>

        {/* 牌阵选择 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-300 text-center">选择牌阵</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spreadTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSpreadType(type.id as any)}
                className={`mystic-card p-4 transition-all ${
                  spreadType === type.id 
                    ? 'ring-2 ring-purple-500 bg-purple-800/30' 
                    : 'hover:bg-purple-800/20'
                }`}
              >
                <h4 className="font-semibold text-purple-300 mb-2">{type.name}</h4>
                <p className="text-gray-400 text-sm">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="text-center mb-8">
          <div className="space-x-4">
            <button
              onClick={shuffleCards}
              className="fortune-button"
              disabled={isReading}
            >
              <Shuffle className="mr-2" size={16} />
              洗牌抽卡
            </button>
            
            {selectedCards.length > 0 && (
              <button
                onClick={performReading}
                className="fortune-button"
                disabled={isReading}
              >
                <Eye className="mr-2" size={16} />
                {isReading ? '解读中...' : '开始解读'}
              </button>
            )}
          </div>
        </div>

        {/* 卡牌显示 */}
        {selectedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {selectedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`tarot-card flex flex-col items-center justify-center p-4 ${
                    card.isReversed ? 'rotate-180' : ''
                  }`}
                >
                  <div className="text-xs text-center text-white font-medium">
                    {card.nameCn}
                  </div>
                  <div className="text-2xl mt-2">🎴</div>
                  {card.isReversed && (
                    <div className="text-xs text-red-300 mt-1">逆位</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 解读结果 */}
        {reading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mystic-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
              <span className="mr-2">🔮</span>
              塔罗解读
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {reading}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}