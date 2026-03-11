const { exec } = require('child_process');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('killthelove')
    .setDescription('WILL KILL THE BOT ILYA WILL BE DEAD FOR AROUND 30 SECOND'),
  
  async execute(interaction) {
    delete require.cache[require.resolve('./defaults.json')];
    const defaultss = require('./defaults.json');
    const ylil = ["710257546908139649","769700126016012308"]
    if (
        !interaction.member.roles.cache.has(defaultss.userole) &&
        !ylil.includes(interaction.user.id)
        ) {
        return interaction.reply({ content: "invalid perms bro", ephemeral: true });
        }

    interaction.reply({ content: 'Restarting bot...', ephemeral: true });

    exec('pm2 restart all', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  },
};