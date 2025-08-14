// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: any;
}

// 塔罗牌相关类型
export interface TarotCard {
  position: string;
  card: string;
  isReversed: boolean;
  interpretation: string;
}

export interface TarotReading {
  question: string;
  spreadType: string;
  cards: TarotCard[];
  interpretation: string;
  timestamp: any;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
}

// 占星相关类型
export interface ZodiacSign {
  name: string;
  element: string;
  traits: string[];
  description: string;
}

export interface ChineseZodiac {
  name: string;
  traits: string[];
  description: string;
}

export interface AstrologicalReading {
  westernAstrology: ZodiacSign;
  chineseAstrology: ChineseZodiac;
  analysis: string;
  timestamp: any;
}

// 风水相关类型
export interface FengShuiAnalysis {
  spaceAnalysis: {
    type: string;
    facing?: string;
    description: string;
  };
  analysis: string;
  timestamp: any;
}

export interface FengShuiDirection {
  id: string;
  name: string;
  element: string;
  meaning: string;
  color: string;
}

// 数字命理类型
export interface NumerologyNumbers {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
}

export interface NumerologyReading {
  personalInfo: {
    name: string;
    birthDate: string;
  };
  numbers: NumerologyNumbers;
  interpretation: string;
  timestamp: any;
}

// 手相分析类型
export interface PalmistryReading {
  handInfo: {
    dominantHand: 'left' | 'right';
    description: string;
  };
  analysis: string;
  timestamp: any;
}

// 八字分析类型
export interface BaZiPillar {
  stem: string;
  branch: string;
}

export interface BaZiReading {
  birthInfo: {
    date: string;
    time: string;
    gender: 'male' | 'female';
  };
  baZi: {
    pillars: BaZiPillar[];
    elements: string[];
  };
  analysis: string;
  timestamp: any;
}

// 易经占卜类型
export interface IChingHexagram {
  name: string;
  symbol: string;
  changingLines: number[];
}

export interface IChingReading {
  question: string;
  hexagram: IChingHexagram;
  interpretation: string;
  timestamp: any;
}

// 智能起名类型
export interface NamingRequest {
  lastName: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime?: string;
  preferences?: string[];
  avoidChars?: string[];
  style?: 'traditional' | 'modern' | 'poetic' | 'auspicious';
}

export interface NamingReading {
  personalInfo: {
    lastName: string;
    gender: 'male' | 'female';
    birthDate: string;
    style?: string;
  };
  baZiAnalysis: {
    pillars: BaZiPillar[];
    elements: string[];
  };
  nameRecommendations: string;
  timestamp: any;
}

// 聊天相关类型 - 修复timestamp类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: any; // 统一使用ISO字符串格式
}

export interface ChatSuggestion {
  name: string;
  icon: string;
  questions: string[];
}

export interface FortuneChat {
  message: string;
  timestamp: any;
}

// 占卜师信息类型
export interface MasterInfo {
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  introduction: string;
  philosophy: string;
  tips: string[];
}

// 每日运势类型
export interface DailyFortune {
  message: string;
  date: string;
  timestamp: any;
}

// 幸运元素类型
export interface LuckyElements {
  colors: string[];
  numbers: number[];
  directions: string[];
  timeFrames: string[];
  gemstones?: string[];
  advice: string;
}

// 通用表单类型
export interface FormData {
  [key: string]: any;
}

// 加载状态类型
export interface LoadingState {
  [key: string]: boolean;
}

// 错误状态类型
export interface ErrorState {
  [key: string]: string | null;
}

// 用户偏好类型
export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: 'zh' | 'en';
  notifications?: boolean;
  favoriteServices?: string[];
}

// 历史记录类型
export interface HistoryRecord {
  id: string;
  type: 'tarot' | 'astrology' | 'fengshui' | 'numerology' | 'palmistry' | 'bazi' | 'iching' | 'naming' | 'chat';
  title: string;
  data: any;
  timestamp: any;
}