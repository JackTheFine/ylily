const { exec } = require('child_process');
const { SlashCommandBuilder, WebhookClient } = require('discord.js');
const wh = "https://discord.com/api/webhooks/1481113269052899451/S6Yoovnmqe0p9nCPo3qV5-qyGyJIAGelggyKzrkicdh1XotST-5WJogysTZcrP3_ajw7"
const webhookClient = new WebhookClient({ url: wh });

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
    webhookClient.send({ content: `${message.author.tag} just did a bot restart`, username: 'ylily logger' });

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