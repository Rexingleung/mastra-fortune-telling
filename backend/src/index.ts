import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { tarotHandler } from './handlers/tarot';
import { fengshuiHandler } from './handlers/fengshui';
import { zodiacHandler } from './handlers/zodiac';
import { namingHandler } from './handlers/naming';
import { guziHandler } from './handlers/guzi';
import { chatHandler } from './handlers/chat';

type Bindings = {
  FORTUNE_KV: KVNamespace;
  OPENAI_API_KEY?: string;
  MASTRA_API_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS配置
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 健康检查
app.get('/', (c) => {
  return c.json({ 
    message: '天机阁 API 服务运行中 🔮',
    timestamp: new Date().toISOString(),
    services: ['tarot', 'fengshui', 'zodiac', 'naming', 'guzi', 'chat']
  });
});

// API路由
app.route('/api/tarot', tarotHandler);
app.route('/api/fengshui', fengshuiHandler);
app.route('/api/zodiac', zodiacHandler);
app.route('/api/naming', namingHandler);
app.route('/api/guzi', guziHandler);
app.route('/api/chat', chatHandler);

// 404处理
app.notFound((c) => {
  return c.json({ error: '未找到请求的API端点' }, 404);
});

// 错误处理
app.onError((err, c) => {
  console.error('API错误:', err);
  return c.json({ error: '服务器内部错误，请稍后重试' }, 500);
});

export default app;