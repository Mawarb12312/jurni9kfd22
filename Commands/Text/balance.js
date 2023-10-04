const { MessageEmbed } = require("discord.js");
const Bal = require("../../utils/schema/balance.js");
const {
  COLOR,
  Prefix,
  UP,
  DOWN,
  VERIF,
  BOT,
  ARROW,
  WL,
  HISTORY,
  FOOTER,
  TITLE,
  LOADING,
  NO,
  BGL,
  DL,
  MONEY,
} = require("../../config.json");

module.exports = {
  name: `${ARROW} ${Prefix}balance -- To show current user balance`,
  aliases: ["bal"],
  accessableby: "everyone",
  description: "Shows Current Balance",
  usage: "[GrowID U Want To Check Or Tag User] (Optional)",
  run: async (client, message, args) => {
    async function getDiscordID(growID) {
      const data = await Bal.findOne({ GrowID: growID })
        .then((d) => {
          return d?.DiscordID;
        })
        .catch((e) => console.error(e));
      return data;
    }
    let dcId = await getDiscordID(args[0]);
    if (!dcId && !message.mentions.users.first()) console.log(dcId);

    let user = message.mentions.users.first()?.id
      ? message.mentions.users.first().id
      : dcId
      ? dcId
      : message.author.id;
    if (!user)
      return m.reply(
        `${NO} | Can't find growid, please do ${Prefix}set growid first`
      );

    let wallet1 = await Bal.findOne({ DiscordID: user })
      .then((d) => {
        return d;
      })
      .catch((e) => console.error(e));

    if (!wallet1)
      return message.reply(
        `${NO} | Can't find growid, please do ${Prefix}set growid first`
      );
    //let wallet = wallet1.Balance;
    // message.reply(wallet1.DiscordID);

    let Balance = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${BGL} | Balance Information`)
      .setFooter(FOOTER)
      .setTimestamp()
      .setDescription(
        "**" +
          "\n" +
          BOT +
          " GrowID" +
          "\n" +
          ARROW +
          wallet1.GrowID +
          " " +
          `\n\n` +
          MONEY +
          ` Balance` +
          "\n" +
          " " +
          ARROW +
          wallet1.Balance +
          "**" +
          " " +
          WL +
          `\n\n ${VERIF} | Verified Balance`
      );
    message.channel.send({ embeds: [Balance] });
  },
};
