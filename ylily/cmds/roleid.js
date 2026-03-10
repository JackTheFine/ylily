const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleid')
    .setDescription('Get the ID of a role')
    .addRoleOption(option =>
      option
        .setName('target')
        .setDescription('The role you want to get the ID of')
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
    const role = interaction.options.getRole('target');
    await interaction.reply({content: `The role ID of **${role.name}** is: \`${role.id}\``});
  },
};
