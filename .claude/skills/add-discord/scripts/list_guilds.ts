import { getReadyDiscordClient } from '../lib/discord.js';
import { formatDiscordError, type SkillResult } from '../lib/types.js';

export async function listDiscordGuilds(): Promise<SkillResult> {
  const ready = await getReadyDiscordClient();
  if ('error' in ready) return ready.error;

  try {
    const guilds = ready.client.guilds.cache;
    const guildList = guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
    }));

    return {
      success: true,
      message: `Found ${guildList.length} guilds`,
      data: guildList,
    };
  } catch (err) {
    return formatDiscordError(err, 'Failed to list guilds');
  }
}
