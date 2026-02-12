import { getReadyDiscordClient } from '../lib/discord.js';
import { formatDiscordError, type SkillResult } from '../lib/types.js';

export interface GetUserInput {
  userId: string;
}

export async function getDiscordUser(
  input: GetUserInput,
): Promise<SkillResult> {
  const ready = await getReadyDiscordClient();
  if ('error' in ready) return ready.error;

  try {
    const user = await ready.client.users.fetch(input.userId);
    if (!user) {
      return { success: false, message: `User ${input.userId} not found` };
    }

    return {
      success: true,
      message: 'User info retrieved',
      data: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        bot: user.bot,
        avatar: user.avatarURL(),
      },
    };
  } catch (err) {
    return formatDiscordError(err, 'Failed to get user');
  }
}
