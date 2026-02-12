import { TextChannel } from 'discord.js';

import { getReadyDiscordClient } from '../lib/discord.js';
import { formatDiscordError, type SkillResult } from '../lib/types.js';

export interface GetChannelInfoInput {
  channelId: string;
}

export async function getDiscordChannelInfo(
  input: GetChannelInfoInput,
): Promise<SkillResult> {
  const ready = await getReadyDiscordClient();
  if ('error' in ready) return ready.error;

  try {
    const channel = await ready.client.channels.fetch(input.channelId);
    if (!channel) {
      return {
        success: false,
        message: `Channel ${input.channelId} not found`,
      };
    }

    const info: Record<string, unknown> = {
      id: channel.id,
      type: channel.type,
    };

    if (channel instanceof TextChannel) {
      info.name = channel.name;
      info.topic = channel.topic;
      info.nsfw = channel.nsfw;
      info.guild = channel.guild.name;
    }

    return { success: true, message: 'Channel info retrieved', data: info };
  } catch (err) {
    return formatDiscordError(err, 'Failed to get channel info');
  }
}
