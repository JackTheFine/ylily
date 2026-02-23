const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('deletes all messages in a channel')   ,

  async execute(interaction, client) {
    interaction.reply({ content:"starting" });
    for(i; i < 2000; i++){
        interaction.channel.send("eggs")

    }

  },
};
