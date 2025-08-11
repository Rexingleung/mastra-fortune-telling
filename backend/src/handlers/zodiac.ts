import { Hono } from 'hono';

type Bindings = {
  FORTUNE_KV: KVNamespace;
};

const zodiac = new Hono<{ Bindings: Bindings }>();

// 星座运势接口
zodiac.post('/fortune', async (c) => {
  try {
    const { sign, birthDate, userId } = await c.req.json();
    
    if (!sign) {
      return c.json({ error: '请提供星座信息' }, 400);
    }

    // 生成运势
    const fortune = await generateZodiacFortune(sign, birthDate);
    
    // 存储运势记录
    const fortuneId = `zodiac-${Date.now()}`;
    await c.env.FORTUNE_KV.put(
      fortuneId,
      JSON.stringify({
        sign,
        birthDate,
        fortune,
        userId,
        timestamp: new Date().toISOString(),
        type: 'zodiac'
      }),
      { expirationTtl: 24 * 60 * 60 } // 24小时过期
    );

    return c.json({
      fortuneId,
      fortune,
      sign,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Zodiac fortune error:', error);
    return c.json({ error: '星座运势获取失败，请重试' }, 500);
  }
});

// 生成星座运势
async function generateZodiacFortune(sign: string, birthDate?: string): Promise<string> {
  const signs: Record<string, string> = {
    aries: '白羊座',
    taurus: '金牛座',
    gemini: '双子座',
    cancer: '巨蟹座',
    leo: '狮子座',
    virgo: '处女座',
    libra: '天秤座',
    scorpio: '天蝎座',
    sagittarius: '射手座',
    capricorn: '摩羯座',
    aquarius: '水瓶座',
    pisces: '双鱼座'
  };
  
  const signName = signs[sign] || sign;
  
  return `⭐ ${signName}运势\n\n💝 爱情运势：${getRandomFortune('love')}\n\n💼 事业运势：${getRandomFortune('career')}\n\n💰 财富运势：${getRandomFortune('wealth')}\n\n🍃 健康运势：${getRandomFortune('health')}\n\n🔮 整体建议：保持积极心态，相信自己的能力。星星会指引您走向光明的未来。记住，运势只是参考，真正的幸福需要自己去创造。`;
}

// 获取随机运势描述
function getRandomFortune(type: string): string {
  const fortunes: Record<string, string[]> = {
    love: ['桃花运旺盛，有望遇到心仪对象', '感情稳定，与伴侣关系和谐', '需要更多耐心，真爱即将到来'],
    career: ['工作顺利，有晋升机会', '需要保持专注，避免分心', '团队合作将带来好运'],
    wealth: ['财运亨通，投资有收获', '理财需谨慎，避免冲动消费', '偏财运不错，可以小试身手'],
    health: ['身体健康，精力充沛', '注意劳逸结合，避免过度疲劳', '心情愉悦，有助身体康复']
  };
  
  const options = fortunes[type] || ['运势平稳，保持现状即可'];
  return options[Math.floor(Math.random() * options.length)];
}

export { zodiac as zodiacHandler };