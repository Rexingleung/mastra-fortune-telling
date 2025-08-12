import { Hono } from 'hono';
import { FortuneAgent } from '../services/fortuneAgent';

const fengshuiHandler = new Hono<{ Bindings: { DEEPSEEK_API_KEY: string } }>();

fengshuiHandler.post('/analysis', async (c) => {
  try {
    const { spaceType, facing, description, concerns, birthYear } = await c.req.json();

    if (!spaceType || !description) {
      return c.json({ error: '空间类型和描述不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.fengShuiAnalysis({
      spaceType,
      facing,
      description,
      concerns,
      birthYear
    });

    return c.json(result);
  } catch (error) {
    console.error('风水分析错误:', error);
    return c.json({ error: '风水分析服务暂时不可用' }, 500);
  }
});

// 获取空间类型
fengshuiHandler.get('/space-types', (c) => {
  return c.json({
    success: true,
    data: [
      { id: 'home', name: '住宅', description: '家庭居住空间整体分析' },
      { id: 'bedroom', name: '卧室', description: '睡眠和休息空间' },
      { id: 'living_room', name: '客厅', description: '家庭聚会和接待空间' },
      { id: 'kitchen', name: '厨房', description: '饮食和财运相关空间' },
      { id: 'study', name: '书房', description: '学习和工作空间' },
      { id: 'office', name: '办公室', description: '职场工作环境' },
      { id: 'business', name: '商铺', description: '商业经营场所' },
      { id: 'garden', name: '花园', description: '户外绿化空间' }
    ]
  });
});

// 获取朝向选项
fengshuiHandler.get('/directions', (c) => {
  return c.json({
    success: true,
    data: [
      { id: 'north', name: '北方', element: '水', meaning: '事业发展', color: '黑色、蓝色' },
      { id: 'northeast', name: '东北方', element: '土', meaning: '知识智慧', color: '黄色、棕色' },
      { id: 'east', name: '东方', element: '木', meaning: '健康成长', color: '绿色' },
      { id: 'southeast', name: '东南方', element: '木', meaning: '财富兴旺', color: '绿色、紫色' },
      { id: 'south', name: '南方', element: '火', meaning: '名声声誉', color: '红色、橙色' },
      { id: 'southwest', name: '西南方', element: '土', meaning: '爱情婚姻', color: '粉色、黄色' },
      { id: 'west', name: '西方', element: '金', meaning: '子女创意', color: '白色、金色' },
      { id: 'northwest', name: '西北方', element: '金', meaning: '贵人助力', color: '白色、灰色' }
    ]
  });
});

// 获取五行说明
fengshuiHandler.get('/elements', (c) => {
  return c.json({
    success: true,
    data: {
      wood: {
        name: '木',
        colors: ['绿色', '青色'],
        direction: ['东', '东南'],
        represents: '成长、活力、新开始',
        materials: ['木材', '竹子', '植物'],
        shapes: '长方形、柱形'
      },
      fire: {
        name: '火',
        colors: ['红色', '橙色', '紫色'],
        direction: ['南'],
        represents: '激情、名声、认知',
        materials: ['蜡烛', '灯具', '三角形物品'],
        shapes: '三角形、尖形'
      },
      earth: {
        name: '土',
        colors: ['黄色', '棕色', '橙色'],
        direction: ['中央', '东北', '西南'],
        represents: '稳定、滋养、关系',
        materials: ['陶瓷', '石头', '水晶'],
        shapes: '正方形、平面形'
      },
      metal: {
        name: '金',
        colors: ['白色', '灰色', '金属色'],
        direction: ['西', '西北'],
        represents: '精确、清晰、有用的人',
        materials: ['金属', '矿物', '石头'],
        shapes: '圆形、弧形'
      },
      water: {
        name: '水',
        colors: ['黑色', '深蓝色'],
        direction: ['北'],
        represents: '智慧、事业、人生道路',
        materials: ['镜子', '玻璃', '水景'],
        shapes: '波浪形、不规则形'
      }
    }
  });
});

// 获取常见风水问题解决方案
fengshuiHandler.get('/solutions', (c) => {
  return c.json({
    success: true,
    data: [
      {
        problem: '财运不佳',
        solutions: [
          '在东南角放置绿色植物',
          '保持厨房整洁明亮',
          '避免漏水和破损',
          '使用紫色或金色装饰'
        ]
      },
      {
        problem: '感情不顺',
        solutions: [
          '西南角放置成双成对的物品',
          '使用粉色或桃色装饰',
          '避免尖角对床',
          '保持卧室温馨整洁'
        ]
      },
      {
        problem: '事业发展受阻',
        solutions: [
          '北方放置水元素装饰',
          '书桌面向门口',
          '避免背对门而坐',
          '使用蓝色或黑色装饰'
        ]
      },
      {
        problem: '健康问题',
        solutions: [
          '东方放置绿色植物',
          '保持空气流通',
          '避免尖角冲射',
          '使用自然材质装饰'
        ]
      },
      {
        problem: '学业不进',
        solutions: [
          '东北角设置文昌位',
          '使用黄色或土色装饰',
          '保持学习区域整洁',
          '放置文具和书籍'
        ]
      }
    ]
  });
});

export { fengshuiHandler };
