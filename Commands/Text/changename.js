const list = require("../../utils/schema/list.js");
const {
  roleBuyer,
  channelTesti,
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
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}changename **[Kode Produk]** **[Nama Produk]** -- Ganti nama produk`,
  aliases: ["cn", "changenameproduct", "cnp"],
  description: "Change Name Product",
  accessableby: "admin",
  usage: "[Product Code] [Product Name]",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply(`${LOADING} | Kode produk yang terbaru`);
    const code = args.shift();
    if (args.length < 1)
      return message.reply(`${LOADING} | Nama produk yang terbaru?`);
    const productName = args.join(" ");

    const getCode = list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length == 0) {
      message.reply(
        `${NO} | Kode produk tidak ditemukan, silahkan gunakan command ${Prefix}stock`
      );
    } else {
      await list
        .updateOne(
          {
            code: code,
          },
          {
            name: productName,
          }
        )
        .then((d) => {
          message.reply(`${VERIF} | Nama produk berhasil diganti`);
        })
        .catch(console.error);
      const sendToOwner = new MessageEmbed()
        .setTitle(`${HISTORY} | Ganti Nama Produk`)
        .setDescription(
          `
         ${BOT} Admin: <@${
            message.author.id?.toString()
              ? message.author.id.toString()
              : message.author.id
          }>
         ${ARROW} New Name: ${productName}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter(FOOTER);
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
