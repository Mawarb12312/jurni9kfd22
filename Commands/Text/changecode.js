const list = require("../../utils/schema/list.js");
const Price = require("../../utils/schema/price.js");
const shop = require("../../utils/schema/shop.js");
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
  LOADING,
  TITLE,
  NO,
} = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}changecode **[Kode Produk Lama]** **[Kode Produk Baru]**`,
  aliases: ["changecodeproduct", "ccp"],
  description: "Ganti Kode Produk",
  accessableby: "admin",
  usage: "[Kode Produk Lama] [Kode Produk Baru]",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(`${LOADING} | **Nama Kode Produk Lama?**`);
    if (!args[0])
      return message.reply(`${LOADING} | **Nama Kode Produk Lama?**`);
    const code = args.shift();
    if (!args[0])
      return message.reply(`${LOADING} | **Nama Kode Produk Baru?**`);
    const productCode = args[0];

    const getCode = list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length == 0) {
      message.reply(`${NO} | **Tidak ada nama code yang terdaftar**`);
      return;
    } else {
      await list
        .updateOne(
          {
            code: code,
          },
          {
            code: productCode,
          }
        )
        .then(console.log)
        .catch(console.error);
      await Price.updateOne(
        {
          code: code,
        },
        {
          code: productCode,
        }
      )
        .then(console.log)
        .catch(console.error);
      await shop
        .updateOne(
          {
            code: code,
          },
          {
            code: productCode,
          }
        )
        .then(console.log)
        .catch(console.error);
      message.reply(`${VERIF} | **Kode Produk Sudah Terganti**`);
      const sendToOwner = new MessageEmbed()
        .setTitle(`${HISTORY} | Pergantian Kode Produk`)
        .setDescription(
          `
         ${BOT} Admin: <<@${
            message.author.id?.toString()
              ? message.author.id.toString()
              : message.author.id
          }>>
         ${ARROW} New Code: ${productCode}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter(`${FOOTER}`);
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
