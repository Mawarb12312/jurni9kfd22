const Price = require("../../utils/schema/price.js");
const list = require("../../utils/schema/list.js");
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
  LOADING,
  NO,
  MONEY,
} = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
  COLOR,
} = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}setharga **[Kode Produk yang mau diganti]** **[Harga produk yang terbaru]**`,
  aliases: ["setprice", "changeprice", "cp", "sp"],
  accessableby: "admin",
  usage: "[Code Want To Set] [Price U Want To Set]",
  description: "Set Harga",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(
        `${LOADING} | Kode produk apa yang mau diganti harganya?`
      );

    let wut = args[0];
    const getCode = list
      .findOne({ code: wut })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (!getCode)
      return message.reply(
        `${NO} | Kode Produk tidak ditemukan, silahkan menggunakan .stock`
      );

    if (!args[1]) return message.reply(`${NO} | Harga produk terbaru?`);

    let price = Number(args[1]);
    await Price.findOneAndUpdate(
      { code: wut },
      { price: price, code: wut, role: wut },
      { upsert: true, new: true }
    )
      .then((res) => {
        message.reply(
          `${VERIF} Successfully change price ` +
            res.code +
            " for " +
            res.price +
            ` ${WL}`
        );
        const sendToOwner = new MessageEmbed()
          .setTitle(`${HISTORY} | Ganti Harga Produk`)
          .setDescription(
            `
         ${BOT} | Admin: <@${
              message.author.id?.toString()
                ? message.author.id.toString()
                : message.author.id
            }>
         ${ARROW} | Code: ${wut}
         ${MONEY} | New Price: ${price} ${WL}
       `.replace(/ {2,}/g, "")
          )
          .setTimestamp()
          .setColor("RANDOM")
          .setFooter(`${FOOTER}`);
        client.users.send(Owner, { embeds: [sendToOwner] });
      })
      .catch(console.error);
  },
};
