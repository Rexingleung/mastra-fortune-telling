// 输入验证工具函数

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function validateZodiacSign(sign: string): boolean {
  const validSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  return validSigns.includes(sign.toLowerCase());
}

export function validateFengshuiArea(area: string): boolean {
  const validAreas = ['bedroom', 'living', 'kitchen', 'office', 'entrance'];
  return validAreas.includes(area.toLowerCase());
}

export function validateGender(gender: string): boolean {
  return ['male', 'female'].includes(gender.toLowerCase());
}

export function validateChineseName(name: string): boolean {
  // 中文名字验证：2-10个中文字符
  const chineseNameRegex = /^[\u4e00-\u9fa5]{2,10}$/;
  return chineseNameRegex.test(name);
}

export function validateSpreadType(spreadType: string): boolean {
  const validTypes = ['single', 'three', 'celtic'];
  return validTypes.includes(spreadType.toLowerCase());
}

export function sanitizeInput(input: string): string {
  // 移除潜在危险字符
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .substring(0, 1000); // 限制长度
}

export function validateGuziCategory(category: string): boolean {
  const validCategories = ['农时智慧', '人生哲理', '处世之道', '养生之道'];
  return validCategories.includes(category);
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTarotRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.spreadType || !validateSpreadType(data.spreadType)) {
    errors.push('无效的牌阵类型');
  }
  
  if (data.question && typeof data.question !== 'string') {
    errors.push('问题必须是字符串类型');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateNamingRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.surname || typeof data.surname !== 'string' || data.surname.trim().length === 0) {
    errors.push('姓氏不能为空');
  }
  
  if (!data.gender || !validateGender(data.gender)) {
    errors.push('请选择正确的性别');
  }
  
  if (!data.birthDate || !validateDate(data.birthDate)) {
    errors.push('请提供正确的出生日期');
  }
  
  if (data.birthTime && typeof data.birthTime !== 'string') {
    errors.push('出生时间格式不正确');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateZodiacRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.sign || !validateZodiacSign(data.sign)) {
    errors.push('请选择正确的星座');
  }
  
  if (data.birthDate && !validateDate(data.birthDate)) {
    errors.push('出生日期格式不正确');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFengshuiRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.area || !validateFengshuiArea(data.area)) {
    errors.push('请选择正确的咨询区域');
  }
  
  if (data.details && typeof data.details !== 'string') {
    errors.push('详细描述必须是字符串类型');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateGuziRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.category || !validateGuziCategory(data.category)) {
    errors.push('请选择正确的智慧类别');
  }
  
  if (data.question && typeof data.question !== 'string') {
    errors.push('问题必须是字符串类型');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateChatRequest(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.messages || !Array.isArray(data.messages)) {
    errors.push('消息必须是数组类型');
    return { isValid: false, errors };
  }
  
  if (data.messages.length === 0) {
    errors.push('消息数组不能为空');
  }
  
  for (const message of data.messages) {
    if (!message.role || !['user', 'assistant'].includes(message.role)) {
      errors.push('消息角色必须是user或assistant');
    }
    
    if (!message.content || typeof message.content !== 'string') {
      errors.push('消息内容不能为空');
    }
    
    if (message.content && message.content.length > 2000) {
      errors.push('单条消息内容过长');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}