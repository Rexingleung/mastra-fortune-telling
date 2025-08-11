import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

export default function NamingPage() {
  const [formData, setFormData] = useState({
    surname: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    requirements: ''
  });
  const [namesSuggestions, setNamesSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surname || !formData.gender || !formData.birthDate) return;
    
    setIsLoading(true);
    setNamesSuggestions([]);
    
    // 这里应该调用AI API
    setTimeout(() => {
      const mockNames = [
        { name: `${formData.surname}晨阳`, meaning: '早晨的阳光，寓意光明与希望', score: 95, elements: ['火', '土'] },
        { name: `${formData.surname}雨桐`, meaning: '雨中的梅花，高雅脆丽', score: 92, elements: ['水', '木'] },
        { name: `${formData.surname}思远`, meaning: '思维深远，智慧象征', score: 88, elements: ['金', '土'] }
      ];
      setNamesSuggestions(mockNames);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            智能起名 📝
          </h1>
          <p className="text-gray-400 text-lg">
            根据生辰八字和五行理论，为您的宝宝起个好名字
          </p>
        </motion.div>

        {/* 起名表单 */}
        <div className="mystic-card p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  姓氏 *
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  placeholder="请输入姓氏"
                  className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  性别 *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  required
                >
                  <option value="">请选择性别</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  出生日期 *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  出生时间
                </label>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-2">
                特殊要求
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="例如：希望名字含有水元素、寃意智慧等"
                rows={3}
                className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 resize-none"
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="fortune-button bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
              >
                <User className="mr-2" size={16} />
                {isLoading ? '起名中...' : '开始起名'}
              </button>
            </div>
          </form>
        </div>

        {/* 名字建议 */}
        {namesSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-orange-300 text-center mb-6">
              为您推荐的名字
            </h3>
            {namesSuggestions.map((name, index) => (
              <div key={index} className="mystic-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-orange-300">{name.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">评分：</span>
                    <span className="text-lg font-bold text-yellow-400">{name.score}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Sparkles
                          key={i}
                          size={16}
                          className={i < Math.floor(name.score / 20) ? 'text-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{name.meaning}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">五行属性：</span>
                  {name.elements.map((element: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded text-xs">
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}