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
  name: `${ARROW} ${Prefix}removeproduct **[Kode Produk]** -- Menghapus produk dari database`,
  aliases: ["rp", "removep"],
  description: "Remove Product",
  accessableby: "admin",
  usage: "[Product Code]",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(`${LOADING} | Kode produk yang mau dihapus?`);
    const code = args.shift();

    const getCode = await list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (!getCode) {
      message.reply(`${NO} | Tidak ada produk dengan kode tersebut`);
    } else {
      await list
        .deleteOne({ code: code })
        .then((d) => {
          message.reply(`${VERIF} | Produk berhasil dihapus`);
        })
        .catch(console.error);
      const sendToOwner = new MessageEmbed()
        .setTitle(`${HISTORY} | Hapus Produk`)
        .setDescription(
          `
         ${BOT} Admin: <@${
            message.author.id?.toString()
              ? message.author.id.toString()
              : message.author.id
          }>
         ${ARROW} Code: ${code}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter(FOOTER);
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
