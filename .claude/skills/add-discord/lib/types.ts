export interface SkillResult {
  success: boolean;
  message: string;
  data?: unknown;
}

interface DiscordAPIError extends Error {
  status?: number;
  rawError?: {
    retry_after?: number;
    message?: string;
  };
}

export function formatDiscordError(err: unknown, context: string): SkillResult {
  const error = err as DiscordAPIError;

  if (error.status === 429) {
    const retryAfter = error.rawError?.retry_after;
    const retryMsg = retryAfter ? ` Retry after ${retryAfter}s.` : '';
    return {
      success: false,
      message: `Rate limited by Discord.${retryMsg} Please wait before trying again.`,
    };
  }

  const errorMsg = err instanceof Error ? err.message : String(err);
  return { success: false, message: `${context}: ${errorMsg}` };
}
