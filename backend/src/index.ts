import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { tarotHandler } from './handlers/tarot';
import { fengshuiHandler } from './handlers/fengshui';
import { zodiacHandler } from './handlers/zodiac';
import { chatHandler } from './handlers/chat';
import { guziHandler } from './handlers/guzi';

type Bindings = {
  FORTUNE_KV: KVNamespace;
  DEEPSEEK_API_KEY: string;
  MASTRA_API_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS配置
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// 健康检查
app.get('/', (c) => {
  return c.json({ 
    message: '🔮 天机阁 AI 占卜服务运行中',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      tarot: '塔罗牌占卜',
      fengshui: '风水分析', 
      astrology: '占星命理',
      numerology: '数字命理',
      palmistry: '手相分析',
      bazi: '八字算命',
      iching: '易经占卜',
      naming: '智能起名',
      chat: '智能聊天',
      guzi: '谷子文化'
    },
    endpoints: [
      'GET  / - 服务状态',
      'POST /api/tarot/reading - 塔罗占卜',
      'POST /api/fengshui/analysis - 风水分析',
      'POST /api/zodiac/reading - 占星分析',
      'POST /api/zodiac/numerology - 数字命理',
      'POST /api/zodiac/palmistry - 手相分析',
      'POST /api/zodiac/bazi - 八字算命',
      'POST /api/zodiac/iching - 易经占卜',
      'POST /api/zodiac/naming - 智能起名',
      'POST /api/chat/fortune - 占卜聊天',
      'GET  /api/chat/daily-fortune - 每日运势',
      'POST /api/guzi/* - 谷子文化服务'
    ]
  });
});

// API路由
app.route('/api/tarot', tarotHandler);
app.route('/api/fengshui', fengshuiHandler);
app.route('/api/zodiac', zodiacHandler);
app.route('/api/chat', chatHandler);
app.route('/api/guzi', guziHandler);

// API文档
app.get('/api/docs', (c) => {
  return c.json({
    title: '天机阁 API 文档',
    version: '2.0.0',
    description: '融合东西方占卜智慧的 AI 智能占卜平台',
    services: {
      tarot: {
        name: '塔罗牌占卜',
        endpoints: {
          'POST /api/tarot/reading': {
            description: '塔罗牌占卜',
            parameters: {
              spreadType: 'single | three-card | celtic-cross | relationship | career | yes-no',
              question: 'string - 占卜问题'
            }
          },
          'GET /api/tarot/spreads': '获取牌阵类型',
          'GET /api/tarot/cards': '获取塔罗牌信息'
        }
      },
      fengshui: {
        name: '风水分析',
        endpoints: {
          'POST /api/fengshui/analysis': {
            description: '风水分析',
            parameters: {
              spaceType: 'string - 空间类型',
              facing: 'string - 朝向',
              description: 'string - 空间描述',
              concerns: 'array - 关注点',
              birthYear: 'number - 出生年份'
            }
          },
          'GET /api/fengshui/space-types': '获取空间类型',
          'GET /api/fengshui/directions': '获取方位信息',
          'GET /api/fengshui/elements': '获取五行信息'
        }
      },
      zodiac: {
        name: '占星命理',
        endpoints: {
          'POST /api/zodiac/reading': '占星分析',
          'POST /api/zodiac/numerology': '数字命理',
          'POST /api/zodiac/palmistry': '手相分析',
          'POST /api/zodiac/bazi': '八字算命',
          'POST /api/zodiac/iching': '易经占卜',
          'POST /api/zodiac/naming': '智能起名',
          'GET /api/zodiac/signs': '获取星座信息',
          'GET /api/zodiac/chinese-zodiac': '获取生肖信息'
        }
      },
      chat: {
        name: '智能聊天',
        endpoints: {
          'POST /api/chat/fortune': '占卜聊天',
          'GET /api/chat/suggestions': '获取建议问题',
          'GET /api/chat/daily-fortune': '每日运势',
          'GET /api/chat/master-info': '占卜师介绍',
          'POST /api/chat/lucky-elements': '幸运元素',
          'DELETE /api/chat/history/:sessionId': '清除对话历史'
        }
      }
    }
  });
});

// 批量占卜服务
app.post('/api/fortune/comprehensive', async (c) => {
  try {
    const { 
      birthDate, 
      birthTime, 
      birthLocation, 
      fullName, 
      gender,
      questions 
    } = await c.req.json();

    if (!birthDate || !fullName) {
      return c.json({ error: '出生日期和姓名不能为空' }, 400);
    }

    // 这里可以调用多个占卜服务，提供综合分析
    return c.json({
      success: true,
      message: '综合占卜服务即将推出，敬请期待！',
      data: {
        services: ['astrology', 'numerology', 'bazi', 'tarot'],
        recommendation: '建议先使用单项服务进行详细分析'
      }
    });

  } catch (error) {
    console.error('综合占卜错误:', error);
    return c.json({ error: '综合占卜服务暂时不可用' }, 500);
  }
});

// 404处理
app.notFound((c) => {
  return c.json({ 
    error: '未找到请求的API端点',
    available_endpoints: [
      '/api/tarot/*',
      '/api/fengshui/*', 
      '/api/zodiac/*',
      '/api/chat/*',
      '/api/guzi/*'
    ]
  }, 404);
});

// 全局错误处理
app.onError((err, c) => {
  console.error('API错误:', err);
  
  // 检查是否是AI服务错误
  if (err.message?.includes('API key') || err.message?.includes('Deepseek')) {
    return c.json({ 
      error: 'AI 服务配置错误，请检查 API 密钥设置',
      code: 'AI_SERVICE_ERROR'
    }, 503);
  }
  
  // 检查是否是存储错误
  if (err.message?.includes('KV')) {
    return c.json({ 
      error: '数据存储服务暂时不可用',
      code: 'STORAGE_ERROR'
    }, 503);
  }
  
  return c.json({ 
    error: '服务器内部错误，请稍后重试',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  }, 500);
});

export default app;
