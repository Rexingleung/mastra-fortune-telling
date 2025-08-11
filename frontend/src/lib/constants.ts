// 算命网站常量定义

export const ZODIAC_SIGNS = [
  { name: '白羊座', en: 'aries', dates: '3/21-4/19', element: 'fire' },
  { name: '金牛座', en: 'taurus', dates: '4/20-5/20', element: 'earth' },
  { name: '双子座', en: 'gemini', dates: '5/21-6/20', element: 'air' },
  { name: '巨蟹座', en: 'cancer', dates: '6/21-7/22', element: 'water' },
  { name: '狮子座', en: 'leo', dates: '7/23-8/22', element: 'fire' },
  { name: '处女座', en: 'virgo', dates: '8/23-9/22', element: 'earth' },
  { name: '天秤座', en: 'libra', dates: '9/23-10/22', element: 'air' },
  { name: '天蝎座', en: 'scorpio', dates: '10/23-11/21', element: 'water' },
  { name: '射手座', en: 'sagittarius', dates: '11/22-12/21', element: 'fire' },
  { name: '摩羯座', en: 'capricorn', dates: '12/22-1/19', element: 'earth' },
  { name: '水瓶座', en: 'aquarius', dates: '1/20-2/18', element: 'air' },
  { name: '双鱼座', en: 'pisces', dates: '2/19-3/20', element: 'water' },
];

export const TAROT_MAJOR_ARCANA = [
  { id: 0, name: 'The Fool', nameCn: '愚者', meaning: '新开始、冒险、天真' },
  { id: 1, name: 'The Magician', nameCn: '魔术师', meaning: '意志力、技能、集中' },
  { id: 2, name: 'The High Priestess', nameCn: '女祭司', meaning: '直觉、潜意识、神秘' },
  { id: 3, name: 'The Empress', nameCn: '皇后', meaning: '母性、丰饶、创造' },
  { id: 4, name: 'The Emperor', nameCn: '皇帝', meaning: '权威、结构、控制' },
  { id: 5, name: 'The Hierophant', nameCn: '教皇', meaning: '传统、宗教、道德' },
  { id: 6, name: 'The Lovers', nameCn: '恋人', meaning: '爱情、关系、选择' },
  { id: 7, name: 'The Chariot', nameCn: '战车', meaning: '意志、决心、胜利' },
  { id: 8, name: 'Strength', nameCn: '力量', meaning: '勇气、耐心、自控' },
  { id: 9, name: 'The Hermit', nameCn: '隐者', meaning: '内省、指导、孤独' },
  { id: 10, name: 'Wheel of Fortune', nameCn: '命运之轮', meaning: '变化、循环、命运' },
  { id: 11, name: 'Justice', nameCn: '正义', meaning: '平衡、公正、真理' },
  { id: 12, name: 'The Hanged Man', nameCn: '倒吊人', meaning: '牺牲、等待、新视角' },
  { id: 13, name: 'Death', nameCn: '死神', meaning: '转变、结束、重生' },
  { id: 14, name: 'Temperance', nameCn: '节制', meaning: '平衡、调和、节制' },
  { id: 15, name: 'The Devil', nameCn: '恶魔', meaning: '诱惑、束缚、物质' },
  { id: 16, name: 'The Tower', nameCn: '塔', meaning: '突变、毁灭、启示' },
  { id: 17, name: 'The Star', nameCn: '星星', meaning: '希望、灵感、指引' },
  { id: 18, name: 'The Moon', nameCn: '月亮', meaning: '幻象、恐惧、潜意识' },
  { id: 19, name: 'The Sun', nameCn: '太阳', meaning: '成功、快乐、活力' },
  { id: 20, name: 'Judgement', nameCn: '审判', meaning: '觉醒、重生、宽恕' },
  { id: 21, name: 'The World', nameCn: '世界', meaning: '完成、成就、圆满' },
];

export const FENGSHUI_DIRECTIONS = [
  { name: '北方', element: '水', color: ['黑色', '蓝色'], meaning: '事业、智慧' },
  { name: '东北方', element: '土', color: ['黄色', '棕色'], meaning: '知识、技能' },
  { name: '东方', element: '木', color: ['绿色', '青色'], meaning: '健康、家庭' },
  { name: '东南方', element: '木', color: ['绿色', '紫色'], meaning: '财富、丰盛' },
  { name: '南方', element: '火', color: ['红色', '橙色'], meaning: '名声、声誉' },
  { name: '西南方', element: '土', color: ['粉色', '黄色'], meaning: '爱情、关系' },
  { name: '西方', element: '金', color: ['白色', '金色'], meaning: '子女、创造' },
  { name: '西北方', element: '金', color: ['白色', '灰色'], meaning: '贵人、旅行' },
];

export const GUZI_WISDOM_CATEGORIES = [
  {
    name: '农时智慧',
    description: '顺应自然节气的生活哲学',
    icon: '🌾',
    examples: ['春耕夏耘，秋收冬藏', '不违农时，谷不可胜食也']
  },
  {
    name: '人生哲理',
    description: '从谷物生长悟出的人生道理',
    icon: '🌱',
    examples: ['一分耕耘，一分收获', '粒粒皆辛苦']
  },
  {
    name: '处世之道',
    description: '如谷子般谦逊低调的处世智慧',
    icon: '🌾',
    examples: ['谦谦君子，温润如玉', '低头的稻穗，昂头的稗子']
  },
  {
    name: '养生之道',
    description: '五谷杂粮的养生智慧',
    icon: '🥣',
    examples: ['五谷为养，五果为助', '药补不如食补']
  }
];

export const FORTUNE_SERVICES = [
  {
    id: 'tarot',
    name: '塔罗占卜',
    icon: '🎴',
    description: '通过塔罗牌解读未来趋势',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'fengshui',
    name: '风水咨询',
    icon: '🏠',
    description: '居家办公风水布局指导',
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'zodiac',
    name: '星座运势',
    icon: '⭐',
    description: '个人星座运势分析',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'naming',
    name: '智能起名',
    icon: '📝',
    description: '根据生辰八字智能起名',
    color: 'from-orange-600 to-yellow-600'
  },
  {
    id: 'guzi',
    name: '谷子文化',
    icon: '🌾',
    description: '传统谷子文化智慧',
    color: 'from-amber-600 to-orange-600'
  }
];

export const API_ENDPOINTS = {
  TAROT: '/api/tarot',
  FENGSHUI: '/api/fengshui',
  ZODIAC: '/api/zodiac',
  NAMING: '/api/naming',
  GUZI: '/api/guzi',
  CHAT: '/api/chat'
};