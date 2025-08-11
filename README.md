# 天机阁 - AI智能算命网站 🔮

融合塔罗牌、风水、星座、谷子文化和起名功能的现代AI算命平台。

## 项目结构

```
mastra-fortune-telling/
├── frontend/           # React + TypeScript 前端
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/        # 页面
│   │   ├── lib/          # 工具库
│   │   └── types/        # 类型定义
├── backend/            # Cloudflare Workers 后端
│   ├── src/
│   │   ├── handlers/     # 请求处理器
│   │   ├── services/     # 服务层
│   │   └── utils/        # 工具函数
└── docs/              # 文档
```

## 功能特色

- 🎴 **塔罗牌占卜** - AI解读塔罗牌
- 🏠 **风水咨询** - 居家风水建议
- ⭐ **星座运势** - 个人星座分析
- 🌾 **谷子文化** - 传统文化融合
- 📝 **智能起名** - 根据生辰八字起名

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Mastra Client

### 后端
- Cloudflare Workers
- AI Agent 集成
- REST API

## 开发环境设置

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```

## 部署

### 前端部署
```bash
cd frontend
npm run build
# 部署到您选择的静态网站托管服务
```

### 后端部署
```bash
cd backend
npx wrangler deploy
```

## 环境变量

创建 `frontend/.env` 文件：
```
VITE_MASTRA_API_URL=https://your-worker.your-subdomain.workers.dev
VITE_APP_NAME=天机阁
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
