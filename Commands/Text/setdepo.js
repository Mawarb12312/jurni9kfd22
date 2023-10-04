const depo = require("../../utils/schema/depo.js");
const {
  Owner,
  Admin,
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
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  COLOR,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}setdepo -- Mengatur informasi deposit`,
  aliases: [],
  description: "Set World Depo",
  accessableby: "admin",
  usage: "[World Name] [Owner Name] [Bot Name] [Saweria URL (Optional)]",
  run: async (client, message, args) => {
    const world = args[0];
    if (!world) return message.reply(`${LOADING} | Nama world depo?`);
    const owner = args[1];
    if (!owner) return message.reply(`${LOADING} | Nama owner world depo?`);
    if (!args[2]) return message.reply(`${LOADING} | Nama bot depo?`);
    const botName = args[2];
    const saweria = args[3] ? args[3] : `${NO}`;
    depo
      .findOneAndUpdate(
        { world: { $exists: true } },
        {
          $set: {
            world: world,
            owner: owner,
            botName: botName,
            saweria: saweria,
          },
        },
        { upsert: true, new: true }
      )
      .then((d) => {
        console.log(d);
        message.reply(VERIF + " | Berhasil set informasi deposit");
        const sendToOwner = new MessageEmbed()
          .setTitle(HISTORY + " | Set Informasi Depo")
          .setDescription(
            `
         ${BOT} Admin: <@${
              message.author.id?.toString()
                ? message.author.id.toString()
                : message.author.id
            }>
        ${ARROW} New World: ${world}
        ${ARROW} New Owner: ${owner}
        ${ARROW} New Bot Name: ${botName}
       `.replace(/ {2,}/g, "")
          )
          .setTimestamp()
          .setColor("RANDOM")
          .setFooter(FOOTER);
        client.users.send(Owner, { embeds: [sendToOwner] });
      })
      .catch((e) => console.error(e));
  },
};
