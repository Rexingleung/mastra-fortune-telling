import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star } from 'lucide-react';
import { ZODIAC_SIGNS } from '../lib/constants';

export default function ZodiacPage() {
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [fortune, setFortune] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getZodiacByDate = (date: string) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    
    // 简化的星座判断逻辑
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    return '';
  };

  const handleDateChange = (date: string) => {
    setBirthDate(date);
    const zodiac = getZodiacByDate(date);
    setSelectedSign(zodiac);
  };

  const generateFortune = async () => {
    if (!selectedSign) return;
    
    setIsLoading(true);
    setFortune('');
    
    // 这里应该调用AI API
    setTimeout(() => {
      const sign = ZODIAC_SIGNS.find(s => s.en === selectedSign);
      setFortune(`${sign?.name}的朋友，您好！\n\n根据星象分析，您最近的运势...\n\n[这里应该是AI生成的详细星座运势]`);
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            星座运势 ⭐
          </h1>
          <p className="text-gray-400 text-lg">
            探索星辰的指引，了解您的运势走向
          </p>
        </motion.div>

        {/* 生日输入 */}
        <div className="mystic-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
            <Calendar className="mr-2" size={20} />
            输入您的生日
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            {selectedSign && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">您的星座：</span>
                <span className="text-blue-300 font-semibold">
                  {ZODIAC_SIGNS.find(s => s.en === selectedSign)?.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 星座选择 */}
        <div className="mystic-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">或直接选择星座</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.en}
                onClick={() => setSelectedSign(sign.en)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedSign === sign.en
                    ? 'border-blue-500 bg-blue-600/30 text-blue-300'
                    : 'border-gray-600 hover:border-blue-500/50 hover:bg-blue-600/10 text-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{sign.name}</div>
                <div className="text-xs text-gray-400 mt-1">{sign.dates}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 运势生成 */}
        {selectedSign && (
          <div className="text-center mb-8">
            <button
              onClick={generateFortune}
              disabled={isLoading}
              className="fortune-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Star className="mr-2" size={16} />
              {isLoading ? '星象解读中...' : '查看运势'}
            </button>
          </div>
        )}

        {/* 运势结果 */}
        {fortune && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mystic-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <span className="mr-2">⭐</span>
              您的星座运势
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {fortune}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}