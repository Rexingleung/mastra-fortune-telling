import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络请求失败',
      };
    }
  }

  // 通用GET请求
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // 通用POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // 通用PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // 通用DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 塔罗牌相关API
  async getTarotSpreads() {
    return this.get('/api/tarot/spreads');
  }

  async getTarotCards() {
    return this.get('/api/tarot/cards');
  }

  async performTarotReading(data: { spreadType: string; question: string }) {
    return this.post('/api/tarot/reading', data);
  }

  // 风水相关API
  async getFengShuiSpaceTypes() {
    return this.get('/api/fengshui/space-types');
  }

  async getFengShuiDirections() {
    return this.get('/api/fengshui/directions');
  }

  async getFengShuiElements() {
    return this.get('/api/fengshui/elements');
  }

  async getFengShuiSolutions() {
    return this.get('/api/fengshui/solutions');
  }

  async performFengShuiAnalysis(data: {
    spaceType: string;
    facing?: string;
    description: string;
    concerns?: string[];
    birthYear?: number;
  }) {
    return this.post('/api/fengshui/analysis', data);
  }

  // 占星命理相关API
  async getZodiacSigns() {
    return this.get('/api/zodiac/signs');
  }

  async getChineseZodiac() {
    return this.get('/api/zodiac/chinese-zodiac');
  }

  async getNumerologyMeanings() {
    return this.get('/api/zodiac/numerology-meanings');
  }

  async performAstrologicalReading(data: {
    birthDate: string;
    birthTime?: string;
    birthLocation: string;
    question?: string;
  }) {
    return this.post('/api/zodiac/reading', data);
  }

  async performNumerologyCalculation(data: {
    fullName: string;
    birthDate: string;
    calculationType?: string;
    comparisonName?: string;
    comparisonBirthDate?: string;
  }) {
    return this.post('/api/zodiac/numerology', data);
  }

  async performPalmistryReading(data: {
    dominantHand: 'left' | 'right';
    lifeLineDescription?: string;
    heartLineDescription?: string;
    headLineDescription?: string;
    generalDescription: string;
  }) {
    return this.post('/api/zodiac/palmistry', data);
  }

  async performBaZiReading(data: {
    birthDate: string;
    birthTime: string;
    gender: 'male' | 'female';
    question?: string;
  }) {
    return this.post('/api/zodiac/bazi', data);
  }

  async performIChingDivination(data: {
    question: string;
    method?: 'three-coin' | 'yarrow-stalk';
  }) {
    return this.post('/api/zodiac/iching', data);
  }

  async performIntelligentNaming(data: {
    lastName: string;
    gender: 'male' | 'female';
    birthDate: string;
    birthTime?: string;
    preferences?: string[];
    avoidChars?: string[];
    style?: 'traditional' | 'modern' | 'poetic' | 'auspicious';
  }) {
    return this.post('/api/zodiac/naming', data);
  }

  // 聊天相关API
  async getChatSuggestions() {
    return this.get('/api/chat/suggestions');
  }

  async getDailyFortune() {
    return this.get('/api/chat/daily-fortune');
  }

  async getMasterInfo() {
    return this.get('/api/chat/master-info');
  }

  async sendFortuneChat(data: {
    message: string;
    context?: string;
    sessionId?: string;
  }) {
    return this.post('/api/chat/fortune', data);
  }

  async getLuckyElements(data: {
    birthDate: string;
    question?: string;
  }) {
    return this.post('/api/chat/lucky-elements', data);
  }

  async clearChatHistory(sessionId: string) {
    return this.delete(`/api/chat/history/${sessionId}`);
  }

  // 谷子文化相关API
  async getGuziContent() {
    return this.get('/api/guzi/content');
  }

  async getGuziWisdom(data: { category?: string }) {
    return this.post('/api/guzi/wisdom', data);
  }

  // 服务状态检查
  async getServiceStatus() {
    return this.get('/');
  }

  async getApiDocs() {
    return this.get('/api/docs');
  }

  // 综合占卜服务
  async performComprehensiveReading(data: {
    birthDate: string;
    birthTime?: string;
    birthLocation?: string;
    fullName?: string;
    gender?: 'male' | 'female';
    questions?: string[];
  }) {
    return this.post('/api/fortune/comprehensive', data);
  }
}

// 创建单例实例
const apiClient = new ApiClient();

// 导出实例和类
export { ApiClient };
export default apiClient;

// 导出便捷的API调用函数
export const api = {
  // 塔罗牌
  tarot: {
    getSpreads: () => apiClient.getTarotSpreads(),
    getCards: () => apiClient.getTarotCards(),
    performReading: (data: { spreadType: string; question: string }) => 
      apiClient.performTarotReading(data),
  },

  // 风水
  fengshui: {
    getSpaceTypes: () => apiClient.getFengShuiSpaceTypes(),
    getDirections: () => apiClient.getFengShuiDirections(),
    getElements: () => apiClient.getFengShuiElements(),
    getSolutions: () => apiClient.getFengShuiSolutions(),
    performAnalysis: (data: {
      spaceType: string;
      facing?: string;
      description: string;
      concerns?: string[];
      birthYear?: number;
    }) => apiClient.performFengShuiAnalysis(data),
  },

  // 占星命理
  zodiac: {
    getSigns: () => apiClient.getZodiacSigns(),
    getChineseZodiac: () => apiClient.getChineseZodiac(),
    getNumerologyMeanings: () => apiClient.getNumerologyMeanings(),
    performAstrologicalReading: (data: {
      birthDate: string;
      birthTime?: string;
      birthLocation: string;
      question?: string;
    }) => apiClient.performAstrologicalReading(data),
    performNumerology: (data: {
      fullName: string;
      birthDate: string;
      calculationType?: string;
      comparisonName?: string;
      comparisonBirthDate?: string;
    }) => apiClient.performNumerologyCalculation(data),
    performPalmistry: (data: {
      dominantHand: 'left' | 'right';
      lifeLineDescription?: string;
      heartLineDescription?: string;
      headLineDescription?: string;
      generalDescription: string;
    }) => apiClient.performPalmistryReading(data),
    performBaZi: (data: {
      birthDate: string;
      birthTime: string;
      gender: 'male' | 'female';
      question?: string;
    }) => apiClient.performBaZiReading(data),
    performIChing: (data: {
      question: string;
      method?: 'three-coin' | 'yarrow-stalk';
    }) => apiClient.performIChingDivination(data),
    performNaming: (data: {
      lastName: string;
      gender: 'male' | 'female';
      birthDate: string;
      birthTime?: string;
      preferences?: string[];
      avoidChars?: string[];
      style?: 'traditional' | 'modern' | 'poetic' | 'auspicious';
    }) => apiClient.performIntelligentNaming(data),
  },

  // 聊天
  chat: {
    getSuggestions: () => apiClient.getChatSuggestions(),
    getDailyFortune: () => apiClient.getDailyFortune(),
    getMasterInfo: () => apiClient.getMasterInfo(),
    sendMessage: (data: {
      message: string;
      context?: string;
      sessionId?: string;
    }) => apiClient.sendFortuneChat(data),
    getLuckyElements: (data: {
      birthDate: string;
      question?: string;
    }) => apiClient.getLuckyElements(data),
    clearHistory: (sessionId: string) => apiClient.clearChatHistory(sessionId),
  },

  // 谷子文化
  guzi: {
    getContent: () => apiClient.getGuziContent(),
    getWisdom: (data: { category?: string }) => apiClient.getGuziWisdom(data),
  },

  // 系统
  system: {
    getStatus: () => apiClient.getServiceStatus(),
    getDocs: () => apiClient.getApiDocs(),
  },

  // 综合
  comprehensive: {
    performReading: (data: {
      birthDate: string;
      birthTime?: string;
      birthLocation?: string;
      fullName?: string;
      gender?: 'male' | 'female';
      questions?: string[];
    }) => apiClient.performComprehensiveReading(data),
  },
};
