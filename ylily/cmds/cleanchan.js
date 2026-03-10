const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearchan')
    .setDescription('deletes all messages in a channel')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('channel to clear')
        .setRequired(true)
    ),

  async execute(interaction) {
    delete require.cache[require.resolve('./defaults.json')];
  const defaults = require('./defaults.json');
  const ylil = ["710257546908139649","769700126016012308"]
if (
  !interaction.member.roles.cache.has(defaults.userole) &&
  !ylil.includes(interaction.user.id)
) {
  return interaction.reply({ content: "invalid perms bro" , ephemeral: true });
}
    const channel = interaction.options.getChannel('channel');

    await interaction.deferReply({ ephemeral: true });

    if (!channel || !channel.isTextBased()) {
      return interaction.editReply('no');
    }

    let deleted = 0;

    while (true) {
      const messages = await channel.messages.fetch({ limit: 100 });
      if (messages.size === 0) break;

      const bulk = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
      const single = messages.filter(m => !bulk.has(m.id));

      if (bulk.size > 0) {
        const res = await channel.bulkDelete(bulk, true);
        deleted += res.size;
      }

      for (const msg of single.values()) {
        await msg.delete().catch(() => {});
        deleted++;
      }
    }

    await interaction.editReply(`deleted **${deleted}** messages in **${channel.name}**.`);
  },
};
