const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('deletes all messages in a channel')   ,

  async execute(interaction, client) {
    interaction.reply({ content:"starting" });
    for(let i = 0; i < 2000; i++){
        interaction.channel.send("eggs")

    }
    interaction.channel.send(`${interaction.user.tag}`)

  },
};
