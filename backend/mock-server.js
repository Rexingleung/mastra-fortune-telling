const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/', (req, res) => {
  res.json({ 
    message: '天机阁 API 服务运行中 🔮',
    timestamp: new Date().toISOString(),
    services: ['tarot', 'fengshui', 'zodiac', 'naming', 'guzi', 'chat']
  });
});

// 模拟聊天流式接口
app.post('/api/chat/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // 发送元数据
  res.write(`f:${JSON.stringify({messageId: `msg-${Date.now()}`})}\
`);

  const message = '🔮 根据您的问题，我为您解读如下：这是一个充满可能性的时期，建议您保持积极的心态，相信自己的直觉。命运掌握在自己手中，算命只是为您提供参考和启发。';
  
  // 模拟打字机效果
  let i = 0;
  const interval = setInterval(() => {
    if (i < message.length) {
      res.write(`0:\"${message[i]}\"\
`);
      i++;
    } else {
      res.write(`e:${JSON.stringify({ finishReason: 'stop', usage: { promptTokens: 10, completionTokens: 50 } })}\
`);
      res.end();
      clearInterval(interval);
    }
  }, 50);
});

// 塔罗牌API
app.post('/api/tarot/draw', (req, res) => {
  res.json({
    readingId: `reading-${Date.now()}`,
    cards: [
      { 
        id: 0, 
        name: 'The Fool', 
        nameCn: '愚者', 
        meaning: '新开始、冒险、天真', 
        isReversed: false,
        position: '过去'
      },
      { 
        id: 1, 
        name: 'The Magician', 
        nameCn: '魔术师', 
        meaning: '意志力、技能、集中', 
        isReversed: false,
        position: '现在'
      },
      { 
        id: 21, 
        name: 'The World', 
        nameCn: '世界', 
        meaning: '完成、成就、圆满', 
        isReversed: false,
        position: '未来'
      }
    ],
    spreadType: req.body.spreadType || 'three'
  });
});

app.post('/api/tarot/interpret', (req, res) => {
  res.json({
    interpretation: '🔮 塔罗解读\
\
您抽到的牌显示出一个完整的成长历程。愚者代表您勇敢踏出的第一步，魔术师象征您当前具备的能力和决心，而世界牌预示着最终的成功和圆满。\
\
💫 建议：相信自己的直觉，勇敢面对挑战，未来充满可能性。',
    cards: [],
    timestamp: new Date().toISOString()
  });
});

// 星座运势API
app.post('/api/zodiac/fortune', (req, res) => {
  const signs = {
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
  
  const signName = signs[req.body.sign] || req.body.sign;
  
  res.json({
    fortuneId: `zodiac-${Date.now()}`,
    fortune: `⭐ ${signName}运势\
\
💝 爱情运势：桃花运旺盛，有望遇到心仪对象\
💼 事业运势：工作顺利，有晋升机会\
💰 财富运势：财运亨通，投资有收获\
🍃 健康运势：身体健康，精力充沛\
\
🔮 整体建议：保持积极心态，相信自己的能力。星星会指引您走向光明的未来。`,
    sign: req.body.sign,
    timestamp: new Date().toISOString()
  });
});

// 风水咨询API
app.post('/api/fengshui/analyze', (req, res) => {
  const areas = {
    bedroom: '卧室',
    living: '客厅',
    kitchen: '厨房',
    office: '书房',
    entrance: '入口'
  };
  
  const areaName = areas[req.body.area] || req.body.area;
  
  res.json({
    consultationId: `fengshui-${Date.now()}`,
    advice: `🏠 ${areaName}风水建议\
\
根据传统风水理论和现代居住环境，为您提供以下建议：\
\
📍 方位布局：\
- 选择适宜的朝向和位置\
- 避免与厕所门相对\
\
🎨 色彩搭配：\
- 推荐使用温暖色调\
- 避免过于鲜艳的颜色\
\
🪴 物品摆放：\
- 保持整洁有序\
- 适当摆放绿植\
\
💫 特别提醒：风水是环境心理学的体现，营造舒适和谐的居住环境最为重要。`,
    area: req.body.area,
    timestamp: new Date().toISOString()
  });
});

// 起名API
app.post('/api/naming/generate', (req, res) => {
  const { surname, gender } = req.body;
  
  const maleNames = ['晨阳', '浩然', '智达', '思远', '志强', '明辉'];
  const femaleNames = ['雨桐', '静雅', '思雨', '梦琪', '智美', '优雅'];
  
  const namePool = gender === 'male' ? maleNames : femaleNames;
  
  const suggestions = namePool.slice(0, 3).map((name, index) => ({
    name: `${surname}${name}`,
    meaning: '美好的寓意和祥瑞的寄托',
    elements: ['木', '火', '土', '金', '水'][Math.floor(Math.random() * 5)],
    strokeCount: Math.floor(Math.random() * 20) + 10,
    pronunciation: '好听易读',
    score: 90 + index * 2
  }));
  
  res.json({
    namingId: `naming-${Date.now()}`,
    suggestions,
    timestamp: new Date().toISOString()
  });
});

// 谷子文化API
app.post('/api/guzi/wisdom', (req, res) => {
  const wisdoms = {
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
  
  const selectedWisdom = wisdoms[req.body.category] || wisdoms['人生哲理'];
  
  res.json({
    wisdomId: `guzi-${Date.now()}`,
    wisdom: `🌾 ${req.body.category}\
\
📜 古语云：\"${selectedWisdom.wisdom}\"\
\
💡 智慧解读：\
${selectedWisdom.interpretation}\
\
🎯 现代应用：\
${selectedWisdom.application}\
\
🌟 谷子文化提醒我们：生活如种田，需要耐心、勤劳和智慧。顺应自然规律，心怀感恩，生活自然会给我们丰厚的回报。`,
    category: req.body.category,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`🚀 天机阁模拟后端服务器运行在 http://localhost:${PORT}`);
  console.log('💡 这是一个兼容性解决方案，用于macOS版本不兼容时的开发测试');
});