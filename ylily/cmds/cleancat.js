const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cleancat')
    .setDescription('removes channels in cat')
    .addStringOption(option =>
      option
        .setName('categoryid')
        .setDescription('The ID of the category to clean')
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
  return interaction.reply({ content: "invalid perms bro" });
}
    const categoryId = interaction.options.getString('categoryid');
    const category = interaction.guild.channels.cache.get(categoryId);

    await interaction.deferReply({ ephemeral: true });

    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply('no');
    }
    if (interaction.channel.parentId === categoryId) {
      return interaction.editReply("don't do it in the category you're trying to delete!");
    }

    const channels = interaction.guild.channels.cache.filter(c => c.parentId === categoryId);

    if (channels.size === 0) {
      return interaction.editReply(`no channels in **${category.name}**.`);
    }

    let deleted = 0;
    for (const [id, channel] of channels) {
      try {
        await channel.delete(`responsible: ${interaction.user.tag}`);
        deleted++;
      } catch (err) {
        console.error(`error deleting ${channel.name}:`, err);
      }
    }

    await interaction.editReply(`deleted **${deleted}** channels in **${category.name}**.`);
  },
};
