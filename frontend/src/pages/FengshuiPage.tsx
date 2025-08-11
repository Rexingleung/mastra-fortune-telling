import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Home } from 'lucide-react';
import { FENGSHUI_DIRECTIONS } from '../lib/constants';

export default function FengshuiPage() {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const areas = [
    { id: 'bedroom', name: '卧室', icon: '🛏️', description: '休息与感情' },
    { id: 'living', name: '客厅', icon: '🛋️', description: '家庭和谐' },
    { id: 'kitchen', name: '厨房', icon: '🍳', description: '财富与健康' },
    { id: 'office', name: '书房', icon: '📚', description: '事业与学业' },
    { id: 'entrance', name: '入口', icon: '🚪', description: '气场与财运' }
  ];

  const generateAdvice = async () => {
    if (!selectedArea) return;
    
    setIsLoading(true);
    setAdvice('');
    
    // 这里应该调用AI API
    setTimeout(() => {
      const area = areas.find(a => a.id === selectedArea);
      setAdvice(`关于${area?.name}的风水建议：\n\n1. 方位布局：...\n2. 颜色搭配：...\n3. 物品摆放：...\n\n[这里应该是AI生成的详细风水建议]`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            风水咨询 🏠
          </h1>
          <p className="text-gray-400 text-lg">
            调和居家气场，提升生活质量
          </p>
        </motion.div>

        {/* 区域选择 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 text-green-300 text-center">选择您想咨询的区域</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`mystic-card p-6 transition-all transform hover:scale-105 ${
                  selectedArea === area.id 
                    ? 'ring-2 ring-green-500 bg-green-800/30' 
                    : 'hover:bg-green-800/20'
                }`}
              >
                <div className="text-3xl mb-3">{area.icon}</div>
                <h4 className="font-semibold text-green-300 mb-2">{area.name}</h4>
                <p className="text-gray-400 text-xs">{area.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 方位图 */}
        <div className="mystic-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-green-300 text-center flex items-center justify-center">
            <Compass className="mr-2" size={20} />
            八方风水图
          </h3>
          <div className="relative w-80 h-80 mx-auto">
            <div className="absolute inset-0 border-2 border-green-500/30 rounded-full"></div>
            {FENGSHUI_DIRECTIONS.map((direction, index) => {
              const angle = (index * 45) - 90; // 从北方开始
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * 140;
              const y = Math.sin(radian) * 140;
              
              return (
                <div
                  key={direction.name}
                  className="absolute w-16 h-16 flex items-center justify-center bg-green-600/20 border border-green-500/30 rounded-full text-xs text-center transform -translate-x-1/2 -translate-y-1/2 hover:bg-green-600/40 transition-colors cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`
                  }}
                  title={`${direction.name} - ${direction.element}元素`}
                >
                  <div className="text-green-300 font-medium">
                    {direction.name}
                  </div>
                </div>
              );
            })}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">中</span>
            </div>
          </div>
        </div>

        {/* 生成建议 */}
        {selectedArea && (
          <div className="text-center mb-8">
            <button
              onClick={generateAdvice}
              disabled={isLoading}
              className="fortune-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Home className="mr-2" size={16} />
              {isLoading ? '分析中...' : '获取风水建议'}
            </button>
          </div>
        )}

        {/* 建议结果 */}
        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mystic-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-300 flex items-center">
              <span className="mr-2">🏠</span>
              风水建议
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {advice}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}