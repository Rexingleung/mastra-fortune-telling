import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

type Bindings = {
  FORTUNE_KV: KVNamespace;
  MASTRA_API_URL?: string;
};

const chat = new Hono<{ Bindings: Bindings }>();

// AI对话接口
chat.post('/stream', async (c) => {
  try {
    const { messages } = await c.req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: '消息格式错误' }, 400);
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content) {
      return c.json({ error: '消息内容不能为空' }, 400);
    }

    // 返回SSE流
    return streamSSE(c, async (stream) => {
      try {
        // 发送元数据
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await stream.writeSSE({
          data: JSON.stringify({ messageId }),
          event: 'metadata'
        });

        // 模拟AI响应 - 实际应该调用Mastra API
        const response = await generateFortuneResponse(lastMessage.content);
        
        // 分块发送响应
        const chunks = response.split('');
        for (let i = 0; i < chunks.length; i++) {
          await stream.writeSSE({
            data: JSON.stringify(chunks[i]),
            event: 'text'
          });
          // 模拟打字延迟
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 发送结束信号
        await stream.writeSSE({
          data: JSON.stringify({
            finishReason: 'stop',
            usage: {
              promptTokens: lastMessage.content.length,
              completionTokens: response.length
            }
          }),
          event: 'done'
        });

      } catch (error) {
        console.error('Stream error:', error);
        await stream.writeSSE({
          data: JSON.stringify({ error: '算命师暂时无法连接到神秘力量，请稍后再试...' }),
          event: 'error'
        });
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: '请求处理失败' }, 500);
  }
});

// 生成算命响应的辅助函数
async function generateFortuneResponse(question: string): Promise<string> {
  // 这里应该集成Mastra AI Agent
  // 现在返回模拟响应
  
  const keywords = question.toLowerCase();
  
  if (keywords.includes('爱情') || keywords.includes('感情')) {
    return `🌹 爱情运势解析\n\n根据您的问题，我感受到了您对感情的关注。从星象来看，您最近的爱情运势...\n\n💫 建议：保持开放的心态，真诚待人，爱情会在合适的时机到来。`;
  }
  
  if (keywords.includes('工作') || keywords.includes('事业')) {
    return `💼 事业运势解析\n\n您的事业运势正处于上升期，但需要注意...\n\n💫 建议：把握机会，稳步前进，避免急功近利。`;
  }
  
  if (keywords.includes('健康')) {
    return `🍃 健康运势解析\n\n您的身体状况总体良好，但需要注意...\n\n💫 建议：保持规律作息，适度运动，关注心理健康。`;
  }
  
  return `🔮 综合运势解析\n\n根据您的问题，我为您解读如下...\n\n这是一个充满可能性的时期，建议您保持积极的心态，相信自己的直觉。\n\n💫 记住：命运掌握在自己手中，算命只是为您提供参考和启发。`;
}

export { chat as chatHandler };