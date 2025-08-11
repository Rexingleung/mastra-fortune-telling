// API调用封装

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '网络请求失败' }));
      throw new ApiError(response.status, errorData.error || '请求失败');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('API请求错误:', error);
    throw new ApiError(0, '网络连接失败，请检查网络连接');
  }
}

// 塔罗牌API
export const tarotApi = {
  async drawCards(data: { spreadType: string; question?: string }) {
    return apiRequest('/api/tarot/draw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async interpretCards(data: { readingId: string; question?: string }) {
    return apiRequest('/api/tarot/interpret', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 风水API
export const fengshuiApi = {
  async analyzeArea(data: { area: string; details?: string; userId?: string }) {
    return apiRequest('/api/fengshui/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 星座API
export const zodiacApi = {
  async getFortune(data: { sign: string; birthDate?: string; userId?: string }) {
    return apiRequest('/api/zodiac/fortune', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 起名API
export const namingApi = {
  async generateNames(data: {
    surname: string;
    gender: string;
    birthDate: string;
    birthTime?: string;
    requirements?: string;
    userId?: string;
  }) {
    return apiRequest('/api/naming/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 谷子文化API
export const guziApi = {
  async getWisdom(data: { category: string; question?: string; userId?: string }) {
    return apiRequest('/api/guzi/wisdom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 聊天API
export const chatApi = {
  async sendMessage(data: { messages: Array<{ role: string; content: string }> }) {
    // 返回EventSource用于SSE
    const url = `${API_BASE_URL}/api/chat/stream`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, '消息发送失败');
    }
    
    return response;
  },
};

// 健康检查API
export const healthApi = {
  async checkStatus() {
    return apiRequest('/');
  },
};

export { ApiError };