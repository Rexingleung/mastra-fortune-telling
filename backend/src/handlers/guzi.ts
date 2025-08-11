import { Hono } from 'hono';

type Bindings = {
  FORTUNE_KV: KVNamespace;
};

const guzi = new Hono<{ Bindings: Bindings }>();

// 谷子文化智慧接口
guzi.post('/wisdom', async (c) => {
  try {
    const { category, question, userId } = await c.req.json();
    
    if (!category) {
      return c.json({ error: '请选择智慧类别' }, 400);
    }

    // 生成谷子智慧
    const wisdom = await generateGuziWisdom(category, question);
    
    // 存储智慧记录
    const wisdomId = `guzi-${Date.now()}`;
    await c.env.FORTUNE_KV.put(
      wisdomId,
      JSON.stringify({
        category,
        question,
        wisdom,
        userId,
        timestamp: new Date().toISOString(),
        type: 'guzi'
      }),
      { expirationTtl: 30 * 24 * 60 * 60 } // 30天过期
    );

    return c.json({
      wisdomId,
      wisdom,
      category,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Guzi wisdom error:', error);
    return c.json({ error: '智慧获取失败，请重试' }, 500);
  }
});

// 生成谷子文化智慧
async function generateGuziWisdom(category: string, question?: string): Promise<string> {
  const wisdomMap: Record<string, any> = {
    '农时智慧': {
      wisdom: '春种一粒粟，秋收万颗子。',
      interpretation: '这句话告诉我们，任何成功都需要在合适的时机播下种子，然后耐心等待收获。',
      application: '在现代生活中，这提醒我们要把握时机，做好长远规划，不要急于求成。'
    },
    '人生哲理': {
      wisdom: '一分耕耘，一分收获。粒粒皆辛苦。',
      interpretation: '世上没有不劳而获的事情，所有的成就都来自于辛勤的付出。',
      application: '无论是学习、工作还是生活，都需要踏实努力，才能获得相应的回报。'
    },
    '处世之道': {
      wisdom: '低头的稻穗，昂头的稗子。谦谦君子，温润如玉。',
      interpretation: '真正有才华的人往往谦逊低调，而无知的人却喜欢张扬。',
      application: '保持谦逊的态度，虚心学习，不断提升自己，才能获得他人的尊重。'
    },
    '养生之道': {
      wisdom: '五谷为养，五果为助。药补不如食补。',
      interpretation: '谷物是人体营养的基础，水果作为辅助，天然食物比药物补养更好。',
      application: '注重饮食平衡，多吃天然食物，少依赖保健品，这是最好的养生方式。'
    }
  };

  const selectedWisdom = wisdomMap[category] || wisdomMap['人生哲理'];
  
  return `🌾 ${category}\n\n📜 古语云："${selectedWisdom.wisdom}"\n\n💡 智慧解读：\n${selectedWisdom.interpretation}\n\n🎯 现代应用：\n${selectedWisdom.application}\n\n${question ? `\n🤔 针对您的问题「${question}」：\n结合谷子文化的智慧，建议您...\n\n[这里应该是AI生成的个性化建议]` : ''}\n\n🌟 谷子文化提醒我们：生活如种田，需要耐心、勤劳和智慧。顺应自然规律，心怀感恩，生活自然会给我们丰厚的回报。`;
}

export { guzi as guziHandler };