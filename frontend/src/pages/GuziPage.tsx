import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wheat, BookOpen } from 'lucide-react';
import { GUZI_WISDOM_CATEGORIES } from '../lib/constants';

export default function GuziPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [wisdom, setWisdom] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getWisdom = async () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    setWisdom('');
    
    // 这里应该调用AI API
    setTimeout(() => {
      const category = GUZI_WISDOM_CATEGORIES.find(c => c.name === selectedCategory);
      setWisdom(`${category?.name}智慧：\n\n"一分耕耘，一分收获。春种一粒类，秋收万颗子。"\n\n这句谷子文化中的智慧告诉我们...\n\n[这里应该是AI生成的详细解读和应用建议]`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            谷子文化 🌾
          </h1>
          <p className="text-gray-400 text-lg">
            传承千年的农耕智慧，感悟人生道理
          </p>
        </motion.div>

        {/* 智慧分类 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 text-amber-300 text-center">选择您想了解的智慧类别</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUZI_WISDOM_CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`mystic-card p-6 text-left transition-all transform hover:scale-105 ${
                  selectedCategory === category.name 
                    ? 'ring-2 ring-amber-500 bg-amber-800/30' 
                    : 'hover:bg-amber-800/20'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-300 mb-2">{category.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                    <div className="space-y-1">
                      {category.examples.map((example, i) => (
                        <p key={i} className="text-xs text-amber-200 italic">
                          "‘{example}’"
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 获取智慧 */}
        {selectedCategory && (
          <div className="text-center mb-8">
            <button
              onClick={getWisdom}
              disabled={isLoading}
              className="fortune-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <BookOpen className="mr-2" size={16} />
              {isLoading ? '参悟中...' : '获取智慧'}
            </button>
          </div>
        )}

        {/* 智慧内容 */}
        {wisdom && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mystic-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-amber-300 flex items-center">
              <Wheat className="mr-2" size={20} />
              谷子智慧
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {wisdom}
            </div>
          </motion.div>
        )}

        {/* 谷子文化介绍 */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mystic-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-amber-300">什么是谷子文化？</h3>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                谷子文化是中华民族的传统农耕文化，包含了从谷物种植、收获、储藏到食用的全过程智慧。
              </p>
              <p>
                它不仅仅是农业技术，更是一种生活哲学，强调与自然和谐共处，顺应天时，勤劳致富。
              </p>
              <p>
                通过学习谷子文化，我们能够领悟到“一分耕耘，一分收获”的人生道理，学会珍惜粮食，感恩自然。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}