import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [dailyFortune, setDailyFortune] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 获取今日运势
  useEffect(() => {
    const fetchDailyFortune = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/daily-fortune`);
        const data = await response.json();
        if (data.success) {
          setDailyFortune(data.data);
        }
      } catch (error) {
        console.error('获取今日运势失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyFortune();
  }, []);

  const services = [
    {
      id: 'tarot',
      name: '塔罗占卜',
      icon: '🃏',
      description: '探索内心深处的智慧指引',
      gradient: 'from-purple-500 to-pink-500',
      features: ['单张牌占卜', '三张牌牌阵', '凯尔特十字', '感情事业专用']
    },
    {
      id: 'zodiac',
      name: '星座命理',
      icon: '⭐',
      description: '解读星辰密码，洞察命运轨迹',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['西方占星', '中国生肖', '数字命理', '手相分析']
    },
    {
      id: 'fengshui',
      name: '风水布局',
      icon: '🏠',
      description: '调和天地人居，营造和谐空间',
      gradient: 'from-green-500 to-emerald-500',
      features: ['居家风水', '办公风水', '方位分析', '五行调和']
    },
    {
      id: 'chat',
      name: '智能问答',
      icon: '🔮',
      description: '24小时贴心占卜师，随时解答疑惑',
      gradient: 'from-orange-500 to-red-500',
      features: ['实时对话', '个性化指导', '多领域咨询', '历史记录']
    },
    {
      id: 'naming',
      name: '智能起名',
      icon: '📝',
      description: '结合八字五行，为您量身定制好名',
      gradient: 'from-indigo-500 to-purple-500',
      features: ['八字分析', '五行补缺', '音韵优美', '寓意深远']
    },
    {
      id: 'guzi',
      name: '传统文化',
      icon: '🌾',
      description: '传承古老智慧，弘扬中华文化',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['易经占卜', '八字算命', '传统节气', '文化传承']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 星空背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* 头部横幅 */}
        <motion.section 
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-block text-6xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🔮
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-6">
            天机阁
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            融汇东西方占卜智慧，为您揭示人生密码
            <br />
            <span className="text-lg opacity-80">AI 智能占卜，传承千年玄学文化</span>
          </p>
          
          {/* 今日运势卡片 */}
          {dailyFortune && (
            <motion.div 
              className="max-w-2xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center justify-center gap-2">
                <span>🌟</span> 今日运势 <span>🌟</span>
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                {dailyFortune.message?.slice(0, 150)}...
              </p>
              <Link 
                to="/chat"
                className="inline-block mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
              >
                查看完整运势 →
              </Link>
            </motion.div>
          )}

          <motion.div 
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link 
              to="/chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span>🎭</span>
              开始占卜
              <span>✨</span>
            </Link>
          </motion.div>
        </motion.section>

        {/* 服务网格 */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center text-white mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              占卜服务
            </motion.h2>
            <motion.p 
              className="text-center text-gray-300 mb-16 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              选择适合您的占卜方式，让AI智能为您解读人生奥秘
            </motion.p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link to={`/${service.id}`}>
                    <div className={`relative p-8 bg-gradient-to-br ${service.gradient} rounded-2xl shadow-2xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-3xl`}>
                      {/* 背景装饰 */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-300"></div>
                      
                      <div className="relative z-10">
                        <div className="text-5xl mb-4">{service.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                        <p className="text-white/90 mb-6 leading-relaxed">{service.description}</p>
                        
                        <div className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                              <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 inline-flex items-center text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                          开始体验
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 特色功能 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">为什么选择天机阁？</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                结合传统占卜智慧与现代AI技术，为您提供最精准的人生指导
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '🤖', title: 'AI 智能', desc: '先进算法精准分析' },
                { icon: '📚', title: '传统文化', desc: '传承千年占卜智慧' },
                { icon: '🌟', title: '个性定制', desc: '专属您的占卜方案' },
                { icon: '🔒', title: '隐私保护', desc: '严格保护个人信息' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部CTA */}
        <section className="py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl border border-white/20"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              准备好探索您的命运了吗？
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              让天机阁的AI占卜师为您指点迷津，照亮前行的道路
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/chat"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                🔮 立即开始占卜
              </Link>
              <Link 
                to="/tarot"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                🃏 体验塔罗占卜
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
