import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stars, Home, MessageCircle } from 'lucide-react';
import { FORTUNE_SERVICES } from '../lib/constants';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br via-purple-900 from-slate-900 to-slate-900">
      {/* 星空背景 */}
      <div className="overflow-hidden fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* 导航栏 */}
      <nav className="relative z-10 border-b backdrop-blur-md bg-black/20 border-purple-500/30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <span className="text-xl">🔮</span>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                天机阁
              </span>
            </Link>

            <div className="hidden items-center space-x-8 md:flex">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 space-x-1 rounded-lg transition-all ${ isActivePath('/') 
                    ? 'text-purple-300 bg-purple-600/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home size={16} />
                <span>首页</span>
              </Link>
              
              {FORTUNE_SERVICES.map((service) => (
                <Link
                  key={service.id}
                  to={`/${service.id}`}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    isActivePath(`/${service.id}`) 
                      ? 'bg-purple-600/30 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-1">{service.icon}</span>
                  {service.name}
                </Link>
              ))}
              
              <Link
                to="/chat"
                className={`flex items-center px-3 py-2 space-x-1 rounded-lg transition-all ${ isActivePath('/chat') 
                    ? 'text-purple-300 bg-purple-600/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageCircle size={16} />
                <span>AI对话</span>
              </Link>
            </div>

            {/* 移动端菜单 */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="relative z-10">
        {children}
      </main>

      {/* 底部 */}
      <footer className="relative z-10 mt-16 border-t backdrop-blur-md bg-black/20 border-purple-500/30">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4 space-x-2">
              <Stars className="text-purple-400" size={24} />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                天机阁
              </span>
              <Stars className="text-purple-400" size={24} />
            </div>
            <p className="mb-2 text-gray-400">
              融合现代AI技术与传统文化的智能算命平台
            </p>
            <p className="text-sm text-gray-500">
              © 2025 天机阁. 仅供娱乐参考，请理性对待
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}