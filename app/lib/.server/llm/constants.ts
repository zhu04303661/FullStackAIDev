// see https://docs.anthropic.com/en/docs/about-claude/models
export const MAX_TOKENS = 8192;

// limits the number of model responses that can be returned in a single request
export const MAX_RESPONSE_SEGMENTS = 2;

export const MODELS = {
  CLAUDE: 'claude-3-sonnet',
  GPT4O: 'gpt-4-32k'
} as const;

export const MODEL_NAMES = {
  [MODELS.CLAUDE]: 'Claude 3 Sonnet',
  [MODELS.GPT4O]: 'GPT-4 Turbo 32k'
} as const;

export const DEFAULT_MODEL = MODELS.CLAUDE;
