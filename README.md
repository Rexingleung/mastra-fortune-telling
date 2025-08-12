# 天机阁 - AI智能占卜平台 🔮

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Rexingleung/mastra-fortune-telling)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

一个融合东西方占卜智慧的现代化 AI 智能占卜平台，结合传统占卜文化与先进人工智能技术，为用户提供专业、准确、个性化的占卜服务。

## ✨ 项目特色

### 🎯 全面的占卜系统
- **🃏 塔罗占卜** - 多种牌阵，深度解读
- **⭐ 星座命理** - 西方占星与中国生肖双重分析
- **🏠 风水布局** - 专业风水指导与空间优化
- **📊 数字命理** - 生命密码与性格解析
- **✋ 手相分析** - 掌纹解读人生轨迹
- **📜 八字算命** - 传统四柱推命
- **☯️ 易经占卜** - 古老智慧现代应用
- **📝 智能起名** - 结合八字五行的专业起名服务

### 🤖 AI 技术驱动
- **Deepseek AI 模型** - 专业的占卜解读能力
- **智能对话系统** - 24/7 占卜师在线服务
- **个性化分析** - 基于个人信息的定制化解读
- **文化传承** - 尊重和保持传统占卜文化的完整性

### 🌟 现代化体验
- **响应式设计** - 完美适配各种设备
- **沉浸式界面** - 神秘优雅的视觉体验
- **流畅动画** - Framer Motion 驱动的精美过渡效果
- **实时互动** - 即时获得占卜结果

## 🏗️ 技术架构

### 前端技术栈
```typescript
React 18 + TypeScript + Vite
├── 🎨 UI框架: Tailwind CSS + Framer Motion
├── 🛣️ 路由: React Router v6
├── 📡 状态管理: React Hooks + Context API
├── 🔗 HTTP客户端: Fetch API
└── 🎯 类型系统: TypeScript 5.0+
```

### 后端技术栈
```typescript
Cloudflare Workers + Hono
├── 🤖 AI服务: Deepseek API
├── 🗄️ 数据存储: Cloudflare KV
├── 🛡️ 安全性: CORS + 请求验证
├── 📊 监控: 错误处理 + 日志记录
└── ⚡ 性能: 边缘计算 + CDN
```

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18.0.0
- **npm** 或 **yarn**
- **Cloudflare账号** (用于部署后端)
- **Deepseek API Key** (用于AI服务)

### 1. 克隆项目
```bash
git clone https://github.com/Rexingleung/mastra-fortune-telling.git
cd mastra-fortune-telling
```

### 2. 安装依赖

**前端:**
```bash
cd frontend
npm install
```

**后端:**
```bash
cd backend
npm install
```

### 3. 环境配置

**前端 (frontend/.env):**
```env
VITE_API_URL=http://localhost:8787
```

**后端 (backend/wrangler.toml):**
```toml
name = "fortune-telling-api"
main = "src/index.ts"
compatibility_date = "2024-05-01"

[env.production.vars]
DEEPSEEK_API_KEY = "your-deepseek-api-key"

[[env.production.kv_namespaces]]
binding = "FORTUNE_KV"
id = "your-kv-namespace-id"
```

### 4. 本地开发

**启动后端:**
```bash
cd backend
npm run dev
# 服务运行在 http://localhost:8787
```

**启动前端:**
```bash
cd frontend
npm run dev
# 应用运行在 http://localhost:5173
```

### 5. 生产部署

**部署后端到 Cloudflare Workers:**
```bash
cd backend
npm run deploy
```

**构建并部署前端:**
```bash
cd frontend
npm run build
# 将 dist 文件夹部署到您的静态托管服务
```

## 📱 功能展示

### 塔罗占卜
- **多种牌阵**: 单张牌、三张牌、凯尔特十字等
- **专业解读**: AI深度分析每张牌的含义
- **视觉体验**: 精美的卡牌翻转动画效果

### 智能聊天
- **全天候服务**: 24小时在线占卜师
- **上下文记忆**: 智能对话历史管理
- **多领域咨询**: 感情、事业、健康等全方位指导

### 风水分析
- **空间诊断**: 住宅、办公室等多种空间类型
- **五行调和**: 基于传统五行理论的专业建议
- **方位指导**: 精确的方位分析和优化建议

### 星座命理
- **双重分析**: 西方十二星座 + 中国十二生肖
- **数字命理**: 生命数字密码解析
- **性格洞察**: 深入的性格特质分析

## 🔧 API 接口

### 核心接口
```typescript
// 塔罗占卜
POST /api/tarot/reading
{
  "spreadType": "three-card",
  "question": "我的爱情运势如何？"
}

// 风水分析
POST /api/fengshui/analysis
{
  "spaceType": "home",
  "facing": "south",
  "description": "三居室住宅，客厅朝南..."
}

// 智能聊天
POST /api/chat/fortune
{
  "message": "帮我分析一下今年的运势",
  "sessionId": "user-session-123"
}

// 星座分析
POST /api/zodiac/reading
{
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "birthLocation": "北京"
}
```

### 响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}
```

## 🎨 设计亮点

### 视觉设计
- **神秘主题**: 深色渐变背景配合星空效果
- **优雅色彩**: 紫色、粉色、金色的和谐搭配
- **现代字体**: 清晰易读的字体设计
- **响应式布局**: 完美适配手机、平板、桌面

### 交互设计
- **流畅动画**: 页面切换和元素过渡动画
- **反馈机制**: 实时的加载状态和错误提示
- **直观操作**: 简洁明了的用户界面
- **沉浸体验**: 专注于占卜内容的无干扰设计

## 🔒 安全与隐私

- **数据加密**: 所有敏感数据传输加密
- **隐私保护**: 不保存用户个人隐私信息
- **安全存储**: 使用 Cloudflare KV 安全存储会话数据
- **访问控制**: API 访问频率限制和安全验证

## 📊 性能优化

- **边缘计算**: Cloudflare Workers 全球分发
- **缓存策略**: 智能缓存减少响应时间
- **代码分割**: 前端按需加载
- **资源优化**: 图片和静态资源压缩

## 🌍 文化特色

### 传统文化融合
- **东方智慧**: 易经、八字、风水等中华传统文化
- **西方占卜**: 塔罗牌、星座等西方占卜体系
- **文化尊重**: 保持传统占卜文化的严肃性和神秘感
- **现代表达**: 用现代技术传承古老智慧

### 本土化体验
- **中文界面**: 完整的中文用户体验
- **文化背景**: 符合中国用户的占卜习惯
- **节气文化**: 结合中国传统节气文化
- **寓意深远**: 注重占卜结果的文化内涵

## 🤝 贡献指南

我们欢迎各种形式的贡献：

1. **🐛 问题反馈**: 发现 Bug 请提交 Issue
2. **💡 功能建议**: 提出新功能想法
3. **📝 代码贡献**: 提交 Pull Request
4. **📚 文档完善**: 改进项目文档
5. **🎨 设计优化**: 提供设计建议

### 开发流程
1. Fork 项目到您的账号
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- **Deepseek AI** - 提供强大的AI模型支持
- **Cloudflare** - 提供优秀的边缘计算平台
- **React 团队** - 提供出色的前端框架
- **所有贡献者** - 感谢每一位参与项目的开发者

## 📞 联系方式

- **项目作者**: Rex Leung
- **邮箱**: rexingleung@126.com
- **GitHub**: [@Rexingleung](https://github.com/Rexingleung)

## 🔗 相关链接

- [在线演示](https://your-demo-url.com)
- [API 文档](https://your-api-docs.com)
- [设计原型](https://your-figma-link.com)
- [技术博客](https://your-blog-link.com)

---

<div align="center">

**天机阁 - 让AI为您解读人生密码** 🔮

Made with ❤️ by [Rex Leung](https://github.com/Rexingleung)

</div>
