import { Hono } from 'hono';
import { FortuneAgent } from '../services/fortuneAgent';

const zodiacHandler = new Hono<{ Bindings: { DEEPSEEK_API_KEY: string } }>();

// 占星分析
zodiacHandler.post('/reading', async (c) => {
  try {
    const { birthDate, birthTime, birthLocation, question } = await c.req.json();

    if (!birthDate || !birthLocation) {
      return c.json({ error: '出生日期和地点不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.astrologicalReading({
      birthDate,
      birthTime,
      birthLocation,
      question
    });

    return c.json(result);
  } catch (error) {
    console.error('占星分析错误:', error);
    return c.json({ error: '占星分析服务暂时不可用' }, 500);
  }
});

// 数字命理
zodiacHandler.post('/numerology', async (c) => {
  try {
    const { fullName, birthDate, calculationType, comparisonName, comparisonBirthDate } = await c.req.json();

    if (!fullName || !birthDate) {
      return c.json({ error: '姓名和出生日期不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.numerologyCalculation({
      fullName,
      birthDate,
      calculationType,
      comparisonName,
      comparisonBirthDate
    });

    return c.json(result);
  } catch (error) {
    console.error('数字命理错误:', error);
    return c.json({ error: '数字命理服务暂时不可用' }, 500);
  }
});

// 手相分析
zodiacHandler.post('/palmistry', async (c) => {
  try {
    const { dominantHand, lifeLineDescription, heartLineDescription, headLineDescription, generalDescription } = await c.req.json();

    if (!dominantHand || !generalDescription) {
      return c.json({ error: '主导手和整体描述不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.palmistryReading({
      dominantHand,
      lifeLineDescription,
      heartLineDescription,
      headLineDescription,
      generalDescription
    });

    return c.json(result);
  } catch (error) {
    console.error('手相分析错误:', error);
    return c.json({ error: '手相分析服务暂时不可用' }, 500);
  }
});

// 八字分析
zodiacHandler.post('/bazi', async (c) => {
  try {
    const { birthDate, birthTime, gender, question } = await c.req.json();

    if (!birthDate || !birthTime || !gender) {
      return c.json({ error: '出生日期、时间和性别不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.baZiReading({
      birthDate,
      birthTime,
      gender,
      question
    });

    return c.json(result);
  } catch (error) {
    console.error('八字分析错误:', error);
    return c.json({ error: '八字分析服务暂时不可用' }, 500);
  }
});

// 易经占卜
zodiacHandler.post('/iching', async (c) => {
  try {
    const { question, method } = await c.req.json();

    if (!question) {
      return c.json({ error: '问题不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.iChingDivination({
      question,
      method: method || 'three-coin'
    });

    return c.json(result);
  } catch (error) {
    console.error('易经占卜错误:', error);
    return c.json({ error: '易经占卜服务暂时不可用' }, 500);
  }
});

// 智能起名
zodiacHandler.post('/naming', async (c) => {
  try {
    const { lastName, gender, birthDate, birthTime, preferences, avoidChars, style } = await c.req.json();

    if (!lastName || !gender || !birthDate) {
      return c.json({ error: '姓氏、性别和出生日期不能为空' }, 400);
    }

    const fortuneAgent = new FortuneAgent({
      apiKey: c.env.DEEPSEEK_API_KEY
    });

    const result = await fortuneAgent.intelligentNaming({
      lastName,
      gender,
      birthDate,
      birthTime,
      preferences,
      avoidChars,
      style
    });

    return c.json(result);
  } catch (error) {
    console.error('智能起名错误:', error);
    return c.json({ error: '智能起名服务暂时不可用' }, 500);
  }
});

// 获取星座列表
zodiacHandler.get('/signs', (c) => {
  return c.json({
    success: true,
    data: [
      { name: '白羊座', dates: '3/21-4/19', element: '火', traits: ['勇敢', '热情', '冲动'] },
      { name: '金牛座', dates: '4/20-5/20', element: '土', traits: ['稳重', '务实', '固执'] },
      { name: '双子座', dates: '5/21-6/20', element: '风', traits: ['机智', '好奇', '善变'] },
      { name: '巨蟹座', dates: '6/21-7/22', element: '水', traits: ['温柔', '敏感', '顾家'] },
      { name: '狮子座', dates: '7/23-8/22', element: '火', traits: ['自信', '慷慨', '戏剧化'] },
      { name: '处女座', dates: '8/23-9/22', element: '土', traits: ['完美主义', '分析', '服务'] },
      { name: '天秤座', dates: '9/23-10/22', element: '风', traits: ['平衡', '和谐', '外交'] },
      { name: '天蝎座', dates: '10/23-11/21', element: '水', traits: ['深刻', '神秘', '执着'] },
      { name: '射手座', dates: '11/22-12/21', element: '火', traits: ['乐观', '自由', '哲学'] },
      { name: '摩羯座', dates: '12/22-1/19', element: '土', traits: ['责任', '野心', '传统'] },
      { name: '水瓶座', dates: '1/20-2/18', element: '风', traits: ['独立', '创新', '人道'] },
      { name: '双鱼座', dates: '2/19-3/20', element: '水', traits: ['直觉', '梦幻', '同情'] }
    ]
  });
});

// 获取中国生肖列表
zodiacHandler.get('/chinese-zodiac', (c) => {
  return c.json({
    success: true,
    data: [
      { name: '鼠', years: [2020, 2008, 1996, 1984, 1972, 1960], traits: ['机智', '灵活', '适应性强'] },
      { name: '牛', years: [2021, 2009, 1997, 1985, 1973, 1961], traits: ['勤劳', '可靠', '坚韧'] },
      { name: '虎', years: [2022, 2010, 1998, 1986, 1974, 1962], traits: ['勇猛', '自信', '领导力'] },
      { name: '兔', years: [2023, 2011, 1999, 1987, 1975, 1963], traits: ['温和', '谨慎', '优雅'] },
      { name: '龙', years: [2024, 2012, 2000, 1988, 1976, 1964], traits: ['威严', '幸运', '创造力'] },
      { name: '蛇', years: [2025, 2013, 2001, 1989, 1977, 1965], traits: ['智慧', '神秘', '直觉'] },
      { name: '马', years: [2026, 2014, 2002, 1990, 1978, 1966], traits: ['自由', '热情', '活力'] },
      { name: '羊', years: [2027, 2015, 2003, 1991, 1979, 1967], traits: ['温柔', '艺术', '和平'] },
      { name: '猴', years: [2028, 2016, 2004, 1992, 1980, 1968], traits: ['聪明', '活泼', '创新'] },
      { name: '鸡', years: [2029, 2017, 2005, 1993, 1981, 1969], traits: ['勤奋', '准时', '自信'] },
      { name: '狗', years: [2030, 2018, 2006, 1994, 1982, 1970], traits: ['忠诚', '正直', '责任'] },
      { name: '猪', years: [2031, 2019, 2007, 1995, 1983, 1971], traits: ['善良', '宽容', '享受'] }
    ]
  });
});

// 获取数字命理含义
zodiacHandler.get('/numerology-meanings', (c) => {
  return c.json({
    success: true,
    data: {
      lifePathNumbers: {
        1: { meaning: '领导者', traits: ['独立', '创新', '领导力'], challenges: ['固执', '自私'] },
        2: { meaning: '合作者', traits: ['合作', '敏感', '和平'], challenges: ['优柔寡断', '依赖'] },
        3: { meaning: '创造者', traits: ['创造力', '乐观', '表达'], challenges: ['散漫', '肤浅'] },
        4: { meaning: '建设者', traits: ['实用', '稳定', '勤奋'], challenges: ['固执', '限制'] },
        5: { meaning: '自由者', traits: ['自由', '冒险', '多样性'], challenges: ['不稳定', '冲动'] },
        6: { meaning: '养育者', traits: ['责任', '关爱', '家庭'], challenges: ['控制欲', '担忧'] },
        7: { meaning: '寻求者', traits: ['精神性', '分析', '智慧'], challenges: ['孤僻', '完美主义'] },
        8: { meaning: '成就者', traits: ['雄心', '物质', '权力'], challenges: ['贪婪', '工作狂'] },
        9: { meaning: '人道主义者', traits: ['同情', '慷慨', '智慧'], challenges: ['情绪化', '不切实际'] },
        11: { meaning: '直觉者', traits: ['直觉', '灵感', '理想主义'], challenges: ['敏感', '紧张'] },
        22: { meaning: '大师建设者', traits: ['远见', '实用理想主义'], challenges: ['压力', '高期望'] },
        33: { meaning: '大师教师', traits: ['治愈', '指导', '同情心'], challenges: ['牺牲', '负担'] }
      }
    }
  });
});

export { zodiacHandler };
