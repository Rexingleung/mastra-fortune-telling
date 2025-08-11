// 算命相关类型定义

export interface User {
  id: string;
  name: string;
  birthDate: Date;
  birthTime?: string;
  location?: string;
  zodiacSign?: string;
}

export interface FortuneReading {
  id: string;
  userId: string;
  type: 'tarot' | 'fengshui' | 'zodiac' | 'naming' | 'guzi';
  question: string;
  result: string;
  cards?: TarotCard[];
  timestamp: Date;
  confidence: number;
}

export interface TarotCard {
  id: string;
  name: string;
  nameCn: string;
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
  number?: number;
  isReversed: boolean;
  meaning: string;
  reversedMeaning?: string;
  image?: string;
}

export interface ZodiacInfo {
  sign: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  ruling_planet: string;
  lucky_numbers: number[];
  lucky_colors: string[];
  traits: string[];
}

export interface FengshuiAdvice {
  area: 'bedroom' | 'living' | 'kitchen' | 'office' | 'entrance';
  direction: string;
  color_recommendations: string[];
  element_balance: string;
  tips: string[];
}

export interface NameSuggestion {
  name: string;
  meaning: string;
  elements: string[];
  stroke_count: number;
  pronunciation: string;
  score: number;
}

export interface GuziWisdom {
  category: 'philosophy' | 'agriculture' | 'seasonal' | 'life';
  wisdom: string;
  interpretation: string;
  application: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'tarot' | 'fengshui' | 'zodiac' | 'naming' | 'guzi';
  data?: any;
}