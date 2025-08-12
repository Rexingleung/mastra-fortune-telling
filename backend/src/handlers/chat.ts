import { Hono } from 'hono';
import { FortuneAgent } from '../services/fortuneAgent';

const chatHandler = new Hono<{ Bindings: { DEEPSEEK_API_KEY: string, FORTUNE_KV: KVNamespace } }>();

// 智能占卜聊天
chatHandler.post('/fortune', async (c) => {
  try {
    const { message, context, sessionId } = await c.req.json();

    if (!message) {
      return c.json({ error: '消息内容不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    // 获取历史对话上下文
    let conversationHistory = '';
    if (sessionId) {
      try {
        const history = await c.env.FORTUNE_KV.get(`chat_history_${sessionId}`);
        if (history) {
          conversationHistory = history;
        }
      } catch (error) {
        console.warn('无法获取对话历史:', error);
      }
    }

    const result = await fortuneAgent.fortuneChat(message, context || conversationHistory);

    // 保存对话历史
    if (sessionId && result.success) {
      try {
        const newHistory = `${conversationHistory}\n用户: ${message}\n占卜师: ${result.data.message}`;
        await c.env.FORTUNE_KV.put(`chat_history_${sessionId}`, newHistory, {
          expirationTtl: 3600 // 1小时过期
        });
      } catch (error) {
        console.warn('无法保存对话历史:', error);
      }
    }

    return c.json(result);
  } catch (error) {
    console.error('占卜聊天错误:', error);
    return c.json({ error: '占卜师暂时无法回应，请稍后重试' }, 500);
  }
});

// 获取对话建议问题
chatHandler.get('/suggestions', (c) => {
  return c.json({
    success: true,
    data: {
      categories: [
        {
          name: '感情婚姻',
          icon: '💕',
          questions: [
            '我的感情运势如何？',
            '什么时候能遇到真爱？',
            '我和现任的关系前景怎么样？',
            '如何改善我的桃花运？',
            '我适合什么样的伴侣？'
          ]
        },
        {
          name: '事业财运',
          icon: '💼',
          questions: [
            '我的事业发展前景如何？',
            '什么时候财运会好转？',
            '我适合创业吗？',
            '如何提升我的财运？',
            '我的职业规划建议是什么？'
          ]
        },
        {
          name: '健康家庭',
          icon: '🏠',
          questions: [
            '我的健康状况如何？',
            '家庭关系如何改善？',
            '我需要注意什么健康问题？',
            '家人的运势怎么样？',
            '如何营造更好的家庭氛围？'
          ]
        },
        {
          name: '学业成长',
          icon: '📚',
          questions: [
            '我的学业运势如何？',
            '如何提升学习效果？',
            '我适合什么专业方向？',
            '考试运势怎么样？',
            '个人成长建议是什么？'
          ]
        },
        {
          name: '人际关系',
          icon: '👥',
          questions: [
            '我的人际关系如何？',
            '如何改善人缘？',
            '我会遇到贵人吗？',
            '如何处理人际冲突？',
            '社交运势怎么样？'
          ]
        },
        {
          name: '综合运势',
          icon: '🔮',
          questions: [
            '我今年的整体运势如何？',
            '我的人生方向对吗？',
            '未来一年需要注意什么？',
            '我的幸运颜色和数字是什么？',
            '如何开运转运？'
          ]
        }
      ],
      quickQuestions: [
        '今天适合做什么？',
        '我最近需要注意什么？',
        '给我一些人生建议',
        '我的运势如何？',
        '帮我占卜一下'
      ]
    }
  });
});

// 清除会话历史
chatHandler.delete('/history/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    if (!sessionId) {
      return c.json({ error: '会话ID不能为空' }, 400);
    }

    await c.env.FORTUNE_KV.delete(`chat_history_${sessionId}`);

    return c.json({
      success: true,
      message: '对话历史已清除'
    });
  } catch (error) {
    console.error('清除历史错误:', error);
    return c.json({ error: '清除历史失败' }, 500);
  }
});

// 获取今日运势
chatHandler.get('/daily-fortune', async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 尝试从缓存获取今日运势
    const cachedFortune = await c.env.FORTUNE_KV.get(`daily_fortune_${today}`);
    if (cachedFortune) {
      return c.json({
        success: true,
        data: JSON.parse(cachedFortune)
      });
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.fortuneChat(
      '请为今天提供每日运势指导，包括整体运势、财运、爱情运、事业运、健康运，以及开运建议。',
      '今日运势咨询'
    );

    if (result.success) {
      // 缓存今日运势，明天自动过期
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const ttl = Math.floor((tomorrow.getTime() - Date.now()) / 1000);

      await c.env.FORTUNE_KV.put(
        `daily_fortune_${today}`,
        JSON.stringify({
          message: result.data.message,
          date: today,
          timestamp: new Date().toISOString()
        }),
        { expirationTtl: ttl }
      );
    }

    return c.json(result);
  } catch (error) {
    console.error('每日运势错误:', error);
    return c.json({ error: '每日运势服务暂时不可用' }, 500);
  }
});

// 占卜师介绍
chatHandler.get('/master-info', (c) => {
  return c.json({
    success: true,
    data: {
      name: '天机子',
      title: '天机阁首席占卜师',
      avatar: '🧙‍♂️',
      specialties: [
        '塔罗牌占卜',
        '星座命理',
        '风水布局',
        '易经卜卦',
        '数字命理',
        '手相面相',
        '八字算命',
        '智能起名'
      ],
      introduction: '在下天机子，精研玄学数十载，通晓古今占卜之术。无论是西方塔罗、星座命理，还是东方易经、风水八字，皆有深入研究。愿以所学为您指点迷津，照亮前路。',
      philosophy: '天道有常，人事有变。占卜不在预测固定命运，而在指引正确方向。吾所求者，非预知未来，而是助君明心见性，顺势而为。',
      tips: [
        '占卜结果仅供参考，关键在于自身努力',
        '保持积极心态，命运掌握在自己手中',
        '遇到重大决策时，可寻求占卜指导',
        '定期调整心态和环境，改善运势'
      ]
    }
  });
});

// 获取幸运元素
chatHandler.post('/lucky-elements', async (c) => {
  try {
    const { birthDate, question } = await c.req.json();

    if (!birthDate) {
      return c.json({ error: '出生日期不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const prompt = `根据出生日期 ${birthDate} ${question ? `和问题"${question}"` : ''}，请提供个性化的幸运元素建议，包括幸运颜色、数字、方位、时间等。`;

    const result = await fortuneAgent.fortuneChat(prompt, '幸运元素咨询');

    return c.json(result);
  } catch (error) {
    console.error('幸运元素错误:', error);
    return c.json({ error: '幸运元素服务暂时不可用' }, 500);
  }
});

export { chatHandler };
