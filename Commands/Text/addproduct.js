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
  name: `${Prefix}addproduct **[Kode Produk] [Nama Produk]** -- Menambah produk`,
  aliases: ["ap", "addp"],
  description: "Add Product",
  accessableby: "admin",
  usage: "[Kode Produk] [Nama Produk]",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply(`${LOADING} | Apa kode produknya?`);
    const code = args[0];
    if (args.length < 1)
      return message.reply(`${LOADING} | Apa nama produknya?`);
    const productName = args.join(" ");

    const getCode = await list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    console.log(getCode);
    if (getCode) {
      message.reply(
        `${NO} | Kode sudah ada di database, silahkan ganti dengan kode lainnya`
      );
    } else {
      await new list({
        code: code,
        name: productName,
      })
        .save()
        .then((d) => {
          message.reply(`${VERIF} | Produk berhasil ditambahkan`);
        })
        .catch(console.error);
      const sendToOwner = new MessageEmbed()
        .setTitle(`${HISTORY} | Tambah Produk`)
        .setDescription(
          `
         ${BOT} Admin: <@${
            message.author.id?.toString()
              ? message.author.id.toString()
              : message.author.id
          }>
         ${ARROW} | Code: ${code}
         ${ARROW} | Name: ${productName}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter(`${FOOTER}`);
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
