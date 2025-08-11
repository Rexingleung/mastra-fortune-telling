import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FORTUNE_SERVICES } from '../lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-5xl font-bold md:text-7xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                天机阁
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-300 md:text-2xl">
              融合塔罗牌、风水、星座、谷子文化的<br />
              <span className="font-semibold text-purple-400">AI智能算命平台</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <Link
              to="/chat"
              className="inline-flex items-center px-8 py-4 space-x-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg transition-all duration-300 transform hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-purple-500/25 mystic-glow"
            >
              <span className="text-2xl">🔮</span>
              <span className="text-lg">开始算命</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 服务区域 */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 md:text-4xl"
          >
            专业算命服务
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FORTUNE_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <Link to={`/${service.id}`}>
                  <div className="p-6 transition-all duration-300 transform mystic-card hover:bg-purple-800/30 hover:scale-105 group">
                    <div className="text-center">
                      <div className="mb-4 text-4xl transition-transform duration-300 transform group-hover:scale-110">
                        {service.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-purple-300">
                        {service.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className={`w-full h-1 bg-gradient-to-r ${service.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色介绍 */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              为什么选择天机阁？
            </h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 mystic-card">
                <div className="mb-4 text-3xl">🤖</div>
                <h3 className="mb-2 text-lg font-semibold text-purple-300">AI智能解读</h3>
                <p className="text-sm text-gray-400">
                  融合现代AI技术，提供更准确、更深入的解读
                </p>
              </div>
              
              <div className="p-6 mystic-card">
                <div className="mb-4 text-3xl">🏛️</div>
                <h3 className="mb-2 text-lg font-semibold text-purple-300">传统文化</h3>
                <p className="text-sm text-gray-400">
                  深度融合中华传统文化，传承古代智慧
                </p>
              </div>
              
              <div className="p-6 mystic-card">
                <div className="mb-4 text-3xl">✨</div>
                <h3 className="mb-2 text-lg font-semibold text-purple-300">个性化服务</h3>
                <p className="text-sm text-gray-400">
                  根据个人信息定制，提供专属的算命服务
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
