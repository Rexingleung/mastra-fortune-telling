# 开发指南

## 项目结构

```
mastra-fortune-telling/
├── frontend/                 # React前端应用
│   ├── public/              # 静态资源
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   │   ├── Layout.tsx
│   │   │   └── StarBackground.tsx
│   │   ├── pages/          # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── TarotPage.tsx
│   │   │   ├── FengshuiPage.tsx
│   │   │   ├── ZodiacPage.tsx
│   │   │   ├── NamingPage.tsx
│   │   │   ├── GuziPage.tsx
│   │   │   └── ChatPage.tsx
│   │   ├── lib/            # 工具函数和配置
│   │   │   ├── mastra.ts
│   │   │   └── constants.ts
│   │   ├── types/          # TypeScript类型定义
│   │   │   └── index.ts
│   │   ├── App.tsx         # 主应用组件
│   │   ├── main.tsx        # 应用入口
│   │   └── index.css       # 全局样式
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                 # Cloudflare Workers后端
│   ├── src/
│   │   ├── handlers/       # API处理器
│   │   │   ├── tarot.ts
│   │   │   ├── fengshui.ts
│   │   │   ├── zodiac.ts
│   │   │   ├── naming.ts
│   │   │   ├── guzi.ts
│   │   │   └── chat.ts
│   │   └── index.ts        # Worker主入口
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml       # Cloudflare配置
├── docs/                   # 项目文档
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── FEATURES.md
│   └── DEVELOPMENT.md
└── README.md
```

## 开发环境设置

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Git

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 启动开发服务器

```bash
# 前端开发服务器 (http://localhost:3000)
cd frontend
npm run dev

# 后端开发服务器 (http://localhost:8787)
cd backend
npm run dev
```

## 代码规范

### TypeScript 配置

项目使用严格的TypeScript配置：

- 启用所有严格模式检查
- 路径别名配置 (`@/` 指向 `src/`)
- 现代ES特性支持

### 代码风格

- 使用 ESLint 进行代码检查
- 遵循 React Hooks 最佳实践
- 优先使用函数式组件
- 合理使用 TypeScript 类型

### 命名约定

- **组件**: PascalCase (例: `TarotPage`)
- **文件**: kebab-case 或 PascalCase
- **变量/函数**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **类型接口**: PascalCase with Interface suffix

## 组件开发

### 页面组件模板

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SomeIcon } from 'lucide-react';

export default function NewPage() {
  const [state, setState] = useState('');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            页面标题
          </h1>
          <p className="text-gray-400 text-lg">
            页面描述
          </p>
        </motion.div>
        
        {/* 页面内容 */}
      </div>
    </div>
  );
}
```

### 样式系统

#### Tailwind 自定义类

```css
.mystic-card {
  @apply bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl;
}

.fortune-button {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105;
}
```

#### 动画系统

使用 Framer Motion 创建流畅动画：

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  内容
</motion.div>
```

## API 开发

### Handler 模板

```typescript
import { Hono } from 'hono';

type Bindings = {
  FORTUNE_KV: KVNamespace;
};

const newHandler = new Hono<{ Bindings: Bindings }>();

newHandler.post('/endpoint', async (c) => {
  try {
    const { param } = await c.req.json();
    
    // 业务逻辑
    const result = await processRequest(param);
    
    // 存储结果（可选）
    await c.env.FORTUNE_KV.put(
      `key-${Date.now()}`,
      JSON.stringify(result),
      { expirationTtl: 24 * 60 * 60 }
    );
    
    return c.json({ result });
  } catch (error) {
    console.error('Handler error:', error);
    return c.json({ error: '处理失败' }, 500);
  }
});

export { newHandler };
```

### 错误处理

统一的错误处理模式：

```typescript
try {
  // 业务逻辑
} catch (error) {
  console.error('操作失败:', error);
  return c.json({ 
    error: '用户友好的错误信息'
  }, 500);
}
```

## 测试

### 前端测试

```bash
# 运行ESLint检查
npm run lint

# 类型检查
npm run type-check

# 构建测试
npm run build
```

### 后端测试

```bash
# 本地测试
npm run dev

# 类型检查
npm run build

# 部署预览
wrangler deploy --dry-run
```

### 手动测试清单

- [ ] 所有页面正常加载
- [ ] 导航功能正常
- [ ] 表单提交和验证
- [ ] API接口响应
- [ ] 错误处理
- [ ] 移动端适配
- [ ] 性能和加载速度

## 调试技巧

### 前端调试

1. **React DevTools**: 检查组件状态和props
2. **浏览器开发者工具**: 网络请求和控制台错误
3. **Vite HMR**: 热重载开发体验

### 后端调试

1. **Wrangler logs**: 查看Worker执行日志
   ```bash
   wrangler tail
   ```

2. **本地调试**: 使用 `wrangler dev`

3. **KV数据检查**:
   ```bash
   wrangler kv:key list --binding FORTUNE_KV
   wrangler kv:key get "key-name" --binding FORTUNE_KV
   ```

## 贡献指南

### 提交代码

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码审查

提交前请确保：
- [ ] 代码符合项目规范
- [ ] 添加必要的类型定义
- [ ] 测试覆盖主要功能
- [ ] 更新相关文档
- [ ] 无ESLint错误

### 文档更新

重要更改请同时更新：
- README.md
- API.md (如果涉及API变更)
- FEATURES.md (如果添加新功能)
- 相关的TypeScript类型定义

## 性能监控

### 前端性能

- 使用 Lighthouse 检查性能指标
- 监控 Core Web Vitals
- 分析包大小和加载时间

### 后端性能

- Cloudflare Analytics 监控
- Worker执行时间统计
- KV操作性能分析
- 错误率和可用性监控

## 故障排除

### 常见问题

1. **构建失败**: 检查依赖版本和Node.js版本
2. **API调用失败**: 检查CORS配置和环境变量
3. **样式问题**: 确认Tailwind配置和类名
4. **路由问题**: 检查React Router配置

### 调试步骤

1. 查看控制台错误信息
2. 检查网络请求状态
3. 验证环境变量配置
4. 查看Worker日志
5. 检查KV存储状态

## 最佳实践

### 前端开发

- 使用 React Hooks 管理状态
- 合理使用 useEffect 避免内存泄漏
- 组件props类型定义完整
- 适当使用 memo 优化性能

### 后端开发

- 合理设置KV过期时间
- 统一错误处理格式
- 记录详细的操作日志
- 验证所有输入参数

### 安全考虑

- 永远不要在前端存储敏感信息
- 对所有用户输入进行验证
- 使用HTTPS和安全头
- 定期更新依赖包