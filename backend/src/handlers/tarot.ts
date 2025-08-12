import { Hono } from 'hono';
import { FortuneAgent } from '../services/fortuneAgent';

const tarotHandler = new Hono<{ Bindings: { DEEPSEEK_API_KEY: string } }>();

tarotHandler.post('/reading', async (c) => {
  try {
    const { spreadType, question } = await c.req.json();

    if (!question || !spreadType) {
      return c.json({ error: '问题和牌阵类型不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.tarotReading({
      spreadType,
      question
    });

    return c.json(result);
  } catch (error) {
    console.error('塔罗占卜错误:', error);
    return c.json({ error: '塔罗占卜服务暂时不可用' }, 500);
  }
});

// 获取牌阵类型列表
tarotHandler.get('/spreads', (c) => {
  return c.json({
    success: true,
    data: [
      { id: 'single', name: '单张牌', description: '简单直接的指导' },
      { id: 'three-card', name: '三张牌', description: '过去、现在、未来' },
      { id: 'celtic-cross', name: '凯尔特十字', description: '全面深入的分析' },
      { id: 'relationship', name: '感情牌阵', description: '专注于人际关系' },
      { id: 'career', name: '事业牌阵', description: '职业和财运指导' },
      { id: 'yes-no', name: '是否问题', description: '简单的是非判断' }
    ]
  });
});

// 获取塔罗牌含义
tarotHandler.get('/cards', (c) => {
  const majorArcana = [
    { name: '愚人', number: 0, upright: '新开始、天真、自发', reversed: '鲁莽、愚昧、冒险' },
    { name: '魔术师', number: 1, upright: '意志力、专注、创造', reversed: '操纵、欺骗、缺乏方向' },
    { name: '女祭司', number: 2, upright: '直觉、神秘、内在智慧', reversed: '缺乏直觉、秘密、沉默' },
    { name: '皇后', number: 3, upright: '母性、丰饶、自然', reversed: '依赖、空虚、过度保护' },
    { name: '皇帝', number: 4, upright: '权威、结构、控制', reversed: '专制、刚愎、失控' },
    { name: '教皇', number: 5, upright: '传统、宗教、指导', reversed: '反叛、新方法、无知' },
    { name: '恋人', number: 6, upright: '爱情、和谐、选择', reversed: '失和、错误选择、不忠' },
    { name: '战车', number: 7, upright: '胜利、决心、意志力', reversed: '失败、缺乏方向、失控' },
    { name: '力量', number: 8, upright: '内在力量、勇气、耐心', reversed: '自我怀疑、缺乏信心、滥用力量' },
    { name: '隐者', number: 9, upright: '内省、寻找、指导', reversed: '孤立、迷失、拒绝帮助' },
    { name: '命运之轮', number: 10, upright: '命运、变化、机遇', reversed: '厄运、失控、抗拒改变' },
    { name: '正义', number: 11, upright: '平衡、公平、真相', reversed: '不公、失衡、逃避责任' },
    { name: '倒吊人', number: 12, upright: '牺牲、等待、新视角', reversed: '无意义牺牲、延迟、抗拒' },
    { name: '死神', number: 13, upright: '结束、转变、重生', reversed: '抗拒改变、停滞、腐朽' },
    { name: '节制', number: 14, upright: '平衡、耐心、融合', reversed: '不平衡、过度、缺乏远见' },
    { name: '恶魔', number: 15, upright: '诱惑、束缚、物欲', reversed: '解放、觉醒、克服诱惑' },
    { name: '塔', number: 16, upright: '突然变化、混乱、启示', reversed: '逃避灾难、恐惧改变、内部混乱' },
    { name: '星星', number: 17, upright: '希望、灵感、宁静', reversed: '绝望、缺乏信心、断绝' },
    { name: '月亮', number: 18, upright: '幻觉、直觉、潜意识', reversed: '混乱、恐惧、误解' },
    { name: '太阳', number: 19, upright: '快乐、成功、活力', reversed: '暂时挫折、缺乏成功、消极' },
    { name: '审判', number: 20, upright: '重生、觉醒、宽恕', reversed: '缺乏反省、严厉判断、自我怀疑' },
    { name: '世界', number: 21, upright: '完成、成就、旅行', reversed: '缺乏完成、延迟、停滞' }
  ];

  return c.json({
    success: true,
    data: {
      majorArcana,
      totalCards: majorArcana.length
    }
  });
});

export { tarotHandler };
