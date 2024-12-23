import { getApiKey } from './api-key';
import { handleLLMStream } from './model';
import { MODELS } from './constants';
import { convertToCoreMessages } from 'ai';
import { getSystemPrompt } from './prompts';

export async function streamText(messages: any[]) {
  try {
    // 确保消息数组包含系统提示
    const systemPrompt = getSystemPrompt();
    const allMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    return await handleLLMStream(
      convertToCoreMessages(allMessages),
      systemPrompt,
      MODELS.GPT4O
    );
  } catch (error) {
    console.error('Stream Text Error:', error);
    throw new Error(`处理文本流时发生错误: ${error.message}`);
  }
}

