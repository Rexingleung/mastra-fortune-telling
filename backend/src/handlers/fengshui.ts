import { Hono } from 'hono';

type Bindings = {
  FORTUNE_KV: KVNamespace;
};

const fengshui = new Hono<{ Bindings: Bindings }>();

// 风水咨询接口
fengshui.post('/analyze', async (c) => {
  try {
    const { area, details, userId } = await c.req.json();
    
    if (!area) {
      return c.json({ error: '请选择咨询区域' }, 400);
    }

    // 生成风水建议
    const advice = await generateFengshuiAdvice(area, details);
    
    // 存储咨询记录
    const consultationId = `fengshui-${Date.now()}`;
    await c.env.FORTUNE_KV.put(
      consultationId,
      JSON.stringify({
        area,
        details,
        advice,
        userId,
        timestamp: new Date().toISOString(),
        type: 'fengshui'
      }),
      { expirationTtl: 30 * 24 * 60 * 60 } // 30天过期
    );

    return c.json({
      consultationId,
      advice,
      area,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Fengshui analyze error:', error);
    return c.json({ error: '风水分析失败，请重试' }, 500);
  }
});

// 生成风水建议
async function generateFengshuiAdvice(area: string, details?: string): Promise<string> {
  const areaNames: Record<string, string> = {
    bedroom: '卧室',
    living: '客厅',
    kitchen: '厨房',
    office: '书房',
    entrance: '入口'
  };
  
  const areaName = areaNames[area] || area;
  
  return `🏠 ${areaName}风水建议\n\n根据传统风水理论和现代居住环境，为您提供以下建议：\n\n📍 方位布局：\n- 选择适宜的朝向和位置\n- 避免与厕所门相对\n\n🎨 色彩搭配：\n- 推荐使用温暖色调\n- 避免过于鲜艳的颜色\n\n🪴 物品摆放：\n- 保持整洁有序\n- 适当摆放绿植\n\n💫 特别提醒：风水是环境心理学的体现，营造舒适和谐的居住环境最为重要。`;
}

export { fengshui as fengshuiHandler };