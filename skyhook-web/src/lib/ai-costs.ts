export const AI_COSTS = {
  CHAT: 2000,
  GREETING: 1000,
  RECOMMEND: 2000,
  ANALYTICS: 5000,
} as const

export type AIQueryType = keyof typeof AI_COSTS
