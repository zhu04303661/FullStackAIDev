import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ request }: ActionFunctionArgs) {
  try {
    const { messages } = await request.json<{ messages: Messages }>();
    return await streamText(messages);
  } catch (error) {
    console.error('Chat Action Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || '处理请求时发生错误' 
      }), {
      status: error.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
