import { env } from 'node:process';

type ApiKeys = {
  anthropicApiKey: string;
  azureOpenAIApiKey: string;
  azureOpenAIApiBase: string;
};

type ServiceType = 'anthropic' | 'azure-openai';

export function validateApiKeys(): ApiKeys {
  const requiredKeys = [
    'ANTHROPIC_API_KEY',
    'AZURE_OPENAI_API_KEY',
    'AZURE_OPENAI_API_BASE'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missingKeys.join(', ')}`);
  }

  const keys = {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY!,
    azureOpenAIApiBase: process.env.AZURE_OPENAI_API_BASE!
  };

  // 打印配置信息
  console.log('Azure OpenAI Config:', {
    endpoint: keys.azureOpenAIApiBase,
    model: 'gpt-4-32k',
    apiVersion: '2024-05-01-preview'
  });

  return keys;
}

export function getApiKey(service: ServiceType) {
  const keys = validateApiKeys();
  
  switch (service) {
    case 'anthropic':
      return keys.anthropicApiKey;
    case 'azure-openai':
      return {
        apiKey: keys.azureOpenAIApiKey,
        apiBase: keys.azureOpenAIApiBase
      };
    default:
      throw new Error(`不支持的服务: ${service}`);
  }
}
