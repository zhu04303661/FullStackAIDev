import { AnthropicStream, OpenAIStream } from 'ai';
import { StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
import { AzureOpenAI } from 'openai';
import { getApiKey } from './api-key';
import { MODELS } from './constants';

// 添加消息类型定义
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// 初始化 Anthropic 客户端
const anthropic = new Anthropic({
  apiKey: getApiKey('anthropic'),
});

// 初始化 Azure OpenAI 客户端
const azureKeys = getApiKey('azure-openai');
const azureOpenAI = new AzureOpenAI({
  apiKey: azureKeys.apiKey,
  endpoint: azureKeys.apiBase,
  apiVersion: '2024-05-01-preview',
  defaultModel: 'gpt-4-32k',
});

export async function handleLLMStream(messages: Message[], systemPrompt: string, model: string) {
  try {
    if (model === MODELS.CLAUDE) {
      const response = await anthropic.messages.create({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        stream: true,
      });
      
      const stream = AnthropicStream(response);
      return new StreamingTextResponse(stream);
    } 
    else if (model === MODELS.GPT4O) {
      console.log('Calling GPT-4-32k with messages:', JSON.stringify(messages, null, 2));
      
      const messagesWithSystem = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await azureOpenAI.chat.completions.create({
        messages: messagesWithSystem,
        model: 'gpt-4-32k',
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
        presence_penalty: 0,
        frequency_penalty: 0,
      });

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    }
    
    throw new Error(`不支持的模型: ${model}`);
  } catch (error) {
    console.error('LLM Stream Error:', {
      error,
      status: error.status,
      message: error.message,
      response: error.response,
      headers: error.headers,
    });
    if (error.status === 404) {
      throw new Error(`模型未找到。请确保在 Azure OpenAI 服务中已部署 'gpt-4-32k' 模型。\n原始错误: ${error.message}`);
    }
    throw new Error(`处理消息流时发生错误: ${error.message}`);
  }
}
