const { EmbedBuilder } = require('discord.js');
const defaults = require('./defaults.json');
const discord = require("discord.js");
const { createTranscript } = require('discord-html-transcripts');
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youreluckyily')
    .setDescription('Start randomized speed dating rounds')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Round Time in mins')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('roles')
        .setDescription('Enter the roles you want to select (comma-separated IDs)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('rounds')
        .setDescription('How many rounds to run')
        .setRequired(true)),

  async execute(interaction, client) {
    await interaction.reply({ content: "beginning, this will update when" });
    runSpeedDating(interaction, client).catch(err => {
      console.error("Speed dating crashed:", err);
    });
  }
};

async function runSpeedDating(interaction, client) {
  const input = interaction.options.getString('roles');
  const roles = [...input.matchAll(/<@&(\d+)>/g)].map(m => m[1]);
  const timeMinutes = interaction.options.getInteger('time');
  const rounds = interaction.options.getInteger('rounds');
  const timer = (timeMinutes * 60000) - 60000;

  if (roles.length % 2 !== 0) {
    return interaction.editReply("you must provide an even number of roles.");
  }

  const usedPairs = new Set();

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }


  async function startTimer(channelid, r1, r2) {
    setTimeout(async () => {
      client.channels.cache.get(channelid)?.send("1 minute remaining");

      setTimeout(async () => {
        const ch = client.channels.cache.get(channelid);
        if (!ch) return;
        ch.send("completed, closing");
        await closeChannel(channelid, r1, r2);
      }, 60000);
    }, timer);
  }

  async function closeChannel(channelid, r1, r2) {
    const ch = client.channels.cache.get(channelid);
    if (!ch) return;

    const file = await createTranscript(ch, {
      returnBuffer: false,
      filename: `${ch.name}-SpeedDate.html`
    });
    const uploadMsg1 = client.channels.cache.get(defaults.logChannel) ? await client.channels.cache.get(defaults.logChannel)?.send({ files: [file] }) : null;
    const transcriptUrl1 = uploadMsg1?.attachments.first()?.url;


    /*const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('ylily Ended')
      .setAuthor({ name: 'Ilya Rozabot' })
      .setDescription(`ylily Ended, use the buttons below to view/download transcript.`)
      .addFields(
		{ name: 'Transcript Download', value: `${transcriptUrl1}`, inline: true },
		{ name: 'Round Number', value: `${ri + 1}`, inline: true },
	)
      .setFooter({ text: 'Ilya Rozabot' });

    await client.channels.cache.get(defaults.logChannel)?.send({ embeds: [exampleEmbed] });
*/
    await ch.delete().catch(() => {});
  }

  async function runRound(roundIndex) {
    let shuffled = shuffle([...roles]);
    let pairs = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      const r1 = shuffled[i];
      const r2 = shuffled[i + 1];
      const key = [r1, r2].sort().join("-");

      if (usedPairs.has(key)) {
        let attempts = 0;
        do {
          shuffled = shuffle([...roles]);
          attempts++;
        } while (usedPairs.has([shuffled[i], shuffled[i + 1]].sort().join("-")) && attempts < 10);
      }

      usedPairs.add(key);
      pairs.push([r1, r2]);
    }

    const limitedPairs = pairs.slice(0, 25);

    await Promise.all(
      limitedPairs.map(async ([r1, r2]) => {
        const role1 = interaction.guild.roles.cache.get(r1);
        const role2 = interaction.guild.roles.cache.get(r2);

        const channel = await interaction.guild.channels.create({
          name: `${role1.name}-X-${role2.name}-R$${roundIndex + 1}`,
          type: discord.ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.roles.everyone, deny: [discord.PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [discord.PermissionFlagsBits.ViewChannel] },
            { id: r1, allow: [discord.PermissionFlagsBits.ViewChannel] },
            { id: r2, allow: [discord.PermissionFlagsBits.ViewChannel] },
          ],
          parent: defaults.categoryParent,
        });

        channel.send(`${timeMinutes} Minutes, starting now! (Round ${roundIndex + 1})`);
        startTimer(channel.id, r1, r2);
        await new Promise(r => setTimeout(r, 500));
      })
    );
  }


  for (let i = 0; i < rounds; i++) {
    await runRound(i);

    await new Promise(resolve => setTimeout(resolve, timeMinutes * 60000));
  }

  await interaction.editReply("done");
}
