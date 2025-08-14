# 前端 SSE 流式响应修复指南

## 问题概述

原有的前端代码使用 Mastra Client 进行 SSE 通信，但在 Cloudflare Workers 部署环境中遇到缓冲问题。本修复提供了兼容本地和 Cloudflare 环境的解决方案。

## 修复内容

### 1. 新增文件

- **`src/lib/streaming-client.ts`** - Cloudflare 兼容的 SSE 客户端
- **`src/lib/mastra-enhanced.ts`** - 增强的 Mastra 客户端
- **`src/lib/api-enhanced.ts`** - 增强的 API 客户端
- **`src/hooks/useStreamingChat.ts`** - React Hook 用于流式聊天
- **`src/lib/environment.ts`** - 环境检测和配置
- **`src/pages/ChatPage-enhanced.tsx`** - 修复后的聊天页面
- **`src/App-enhanced.tsx`** - 增强的 App 组件

### 2. 核心改进

#### 环境自适应
```typescript
// 自动检测运行环境
const environment = detectEnvironment(); // 'development' | 'production' | 'cloudflare'

// 根据环境选择合适的 API 端点
const apiUrl = environment === 'development' 
  ? 'http://localhost:4111'
  : window.location.origin;
```

#### 兼容的 SSE 客户端
```typescript
// 支持多种响应格式
if (contentType?.includes('text/event-stream')) {
  await this.handleSSEResponse(response);
} else if (contentType?.includes('application/json')) {
  await this.handleJSONResponse(response);
} else {
  await this.handleTextStreamResponse(response);
}
```

#### React Hook 简化使用
```typescript
const {
  messages,
  isLoading,
  sendMessage,
  stopStream
} = useStreamingChat({
  baseUrl: envConfig.apiUrl
});
```

## 使用方法

### 方法一：替换现有文件

1. **替换 ChatPage**:
   ```bash
   # 备份原文件
   mv src/pages/ChatPage.tsx src/pages/ChatPage-original.tsx
   
   # 使用增强版本
   mv src/pages/ChatPage-enhanced.tsx src/pages/ChatPage.tsx
   ```

2. **替换 App 组件**:
   ```bash
   mv src/App.tsx src/App-original.tsx
   mv src/App-enhanced.tsx src/App.tsx
   ```

3. **更新 mastra 客户端**:
   ```bash
   mv src/lib/mastra.ts src/lib/mastra-original.ts
   mv src/lib/mastra-enhanced.ts src/lib/mastra.ts
   ```

### 方法二：渐进式升级

1. **保留原有代码，添加新功能**:
   ```typescript
   // 在现有组件中导入新的 Hook
   import { useStreamingChat } from '../hooks/useStreamingChat';
   
   // 替换原有的 Mastra 客户端调用
   const { sendMessage } = useStreamingChat();
   ```

2. **按需切换客户端**:
   ```typescript
   import { mastraClient } from '../lib/mastra-enhanced';
   // 或者
   import { apiClient } from '../lib/api-enhanced';
   ```

## 环境配置

### 本地开发
```bash
# .env.local
VITE_MASTRA_API_URL=http://localhost:4111
```

### Cloudflare 部署
```bash
# .env.production 或在 Cloudflare 中设置
VITE_MASTRA_API_URL=https://your-worker.your-subdomain.workers.dev
```

### 自动检测（推荐）
无需手动配置，系统会自动检测环境：
- **localhost**: 使用 `http://localhost:4111`
- **Cloudflare Workers**: 使用当前域名的 origin
- **其他环境**: 使用当前域名的 origin

## 功能对比

| 功能 | 原版本 | 增强版本 |
|------|--------|----------|
| 本地开发 | ✅ | ✅ |
| Cloudflare 部署 | ❌ | ✅ |
| 环境自动检测 | ❌ | ✅ |
| 错误处理 | 基础 | 增强 |
| 重连机制 | 无 | 有 |
| 停止流功能 | 有限 | 完整 |
| 消息清空 | ❌ | ✅ |
| 环境标识 | ❌ | ✅ |

## API 使用示例

### 使用 Hook（推荐）
```typescript
import { useStreamingChat } from '../hooks/useStreamingChat';

function ChatComponent() {
  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    stopStream,
    clearMessages
  } = useStreamingChat();

  const handleSend = async () => {
    await sendMessage('我的爱情运势如何？');
  };

  return (
    <div>
      {/* 消息显示 */}
      {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
      
      {/* 控制按钮 */}
      <button onClick={handleSend} disabled={isLoading}>
        发送
      </button>
      <button onClick={stopStream}>停止</button>
      <button onClick={clearMessages}>清空</button>
    </div>
  );
}
```

### 使用 API 客户端
```typescript
import { streamChat, stopStream } from '../lib/api-enhanced';

// 流式聊天
await streamChat({
  messages: [{ role: 'user', content: '请为我占卜' }],
  onMessage: (content) => {
    console.log('收到消息:', content);
  },
  onComplete: () => {
    console.log('聊天完成');
  },
  onError: (error) => {
    console.error('聊天错误:', error);
  }
});

// 停止流
stopStream();
```

### 使用增强 Mastra 客户端
```typescript
import { mastraClient } from '../lib/mastra-enhanced';

const agent = mastraClient.getAgent('fortuneTellingAgent');
const response = await agent.stream({
  messages: [{ role: 'user', content: '帮我分析运势' }]
});

// 处理流式响应（兼容原有代码）
response.processDataStream({
  onTextPart: (data) => {
    console.log('文本片段:', data);
  },
  onError: (error) => {
    console.error('错误:', error);
  },
  onFinishMessagePart: () => {
    console.log('消息完成');
  }
});
```

## 故障排除

### 1. 环境检测问题
```typescript
import { getEnvironmentConfig, logEnvironmentInfo } from '../lib/environment';

// 检查环境配置
logEnvironmentInfo();

const config = getEnvironmentConfig();
console.log('当前环境:', config.environment);
console.log('API URL:', config.apiUrl);
```

### 2. SSE 连接问题
```typescript
// 检查 SSE 支持
import { isSSESupported, isFetchSupported } from '../lib/environment';

console.log('SSE 支持:', isSSESupported());
console.log('Fetch 支持:', isFetchSupported());
```

### 3. 网络连接测试
```typescript
import { healthCheck } from '../lib/api-enhanced';

// 健康检查
const result = await healthCheck();
if (result.success) {
  console.log('API 连接正常');
} else {
  console.error('API 连接失败:', result.error);
}
```

### 4. 调试模式
```typescript
// 在控制台中查看详细日志
localStorage.setItem('debug', 'true');

// 查看环境信息
logEnvironmentInfo();
```

## 部署注意事项

### 1. Cloudflare Pages
如果使用 Cloudflare Pages 部署前端：
```bash
# 设置环境变量
VITE_MASTRA_API_URL=https://your-worker.your-subdomain.workers.dev
```

### 2. 本地测试 Cloudflare 环境
```bash
# 启动本地前端
npm run dev

# 启动 Cloudflare Workers 开发环境
npm run dev:remote

# 修改 .env.local
VITE_MASTRA_API_URL=http://localhost:8787
```

### 3. 生产环境验证
部署后使用浏览器开发者工具验证：
1. Network 标签页查看请求
2. 确认 SSE 连接类型为 `text/event-stream`
3. 观察数据是否实时到达

## 性能优化

### 1. 减少重连
```typescript
const { sendMessage } = useStreamingChat({
  baseUrl: envConfig.apiUrl,
  onError: (error) => {
    // 避免频繁重连
    setTimeout(() => {
      console.log('准备重新连接...');
    }, 3000);
  }
});
```

### 2. 内存管理
```typescript
// 定期清理消息
const { clearMessages } = useStreamingChat();

// 当消息过多时自动清理
useEffect(() => {
  if (messages.length > 100) {
    const recentMessages = messages.slice(-50);
    setMessages(recentMessages);
  }
}, [messages.length]);
```

## 迁移检查清单

- [ ] 备份原有文件
- [ ] 安装新依赖（如果有）
- [ ] 复制新增文件到项目
- [ ] 更新导入路径
- [ ] 配置环境变量
- [ ] 本地测试功能
- [ ] Cloudflare 环境测试
- [ ] 验证 SSE 流式响应
- [ ] 检查错误处理
- [ ] 性能测试

---

**✨ 修复完成后，你的前端应用将能够在本地和 Cloudflare 环境中提供一致的流式聊天体验！**