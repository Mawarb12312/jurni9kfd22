const shop = require("../../utils/schema/shop.js");
const list = require("../../utils/schema/list.js");
const {
  imageUrl,
  roleBuyer,
  channelTesti,
  Owner,
  COLOR,
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
const Bal = require("../../utils/schema/balance.js");
const Price = require("../../utils/schema/price.js");
const order = require("../../utils/schema/order.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}send **[Item Code]** **[Jumlah]** **[Tag User]** -- Send product to someone`,
  aliases: ["kirim"],
  description: "Send Item",
  accessableby: "admin",
  usage: "[Item Code] [Jumlah] (Optional, Default 1) [Tag User]",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(`${LOADING} | Produk apa yang mau dikirim?`);
    if (!message.mentions.users.first())
      return message.reply(
        `${LOADING} | Silahkan di mention/tag orang mau dikirimkan produk`
      );
    let item = args[0];
    const getCode = await list
      .findOne({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (!getCode)
      return message.reply(
        `${NO} | Kode Produk tidak ditemukan, silahkan gunakan ${Prefix}stock`
      );
    let howmuch;
    let user;
    if (args[1].includes("<@") && args[1].includes(">")) {
      howmuch = 1;
    } else {
      howmuch = args[1];
      if (isNaN(howmuch)) return message.reply(`${NO} | Gunakan angka`);
    }
    user = message.mentions.users.first();

    const data = await shop
      .find({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (data.length == 0) return message.reply(`${NO} | Stock tidak ada`);

    if (Number(data.length) < Number(howmuch))
      return message.reply(`${LOADING} | Stock tidak mencukupi`);
    let sending = "";
    if (!item.includes("script")) {
      for (let i = 0; i < howmuch; i++) {
        let send = await shop
          .findOneAndDelete({ code: item })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        sending += send.data + "\n";
      }
    } else {
      let send = await shop
        .findOne({ code: item })
        .then((res) => {
          return res;
        })
        .catch(console.error);
      sending += send.data;
    }
    try {
      const doneBuy = new MessageEmbed()
        .setTitle(`${VERIF} Sent Product was Successfull`)
        .setDescription(
          "Sent product was successfull\nYou've successfully sent " +
            item +
            ` to ${user}`
        )
        .setImage(imageUrl)
        .setColor("RANDOM")
        .setFooter(`${FOOTER}`);

      client.users.send(user.id, {
        files: [
          {
            attachment: Buffer.from(sending),
            name: `FarhanStore_` + message.author.id + `.txt`,
          },
        ],
        embeds: [doneBuy],
      });
      client.users.send(Owner, {
        files: [
          {
            attachment: Buffer.from(sending),
            name: `FarhanStore_` + message.author.id + `.txt`,
          },
        ],
      });
      message.reply(`${VERIF} | ${user} Please check your DM`);
    } catch (e) {
      console.log(e);
      message.reply(`${user}, Please turn on your DM and contact owner/admin`);
      client.users.send(Owner, {
        content: "This Is Error <@" + message.author.id + "> Order",
        files: [
          {
            attachment: Buffer.from(sending),
            name: "order.txt",
          },
        ],
      });
    }
    let orderN = await order
      .findOneAndUpdate({}, { $inc: { Order: 1 } }, { upsert: true, new: true })
      .then((d) => {
        return d?.Order;
      })
      .catch(console.error);
    if (!orderN) orderN = 1;
    const itemName = await list
      .findOne({ code: item })
      .then((res) => {
        return res?.name;
      })
      .catch(console.error);
    const sendToOwner = new MessageEmbed()
      .setTitle(`${HISTORY} | Kirim Produk History`)
      .setDescription(
        `
         ${BOT} Sender: <@${
          message.author.id?.toString()
            ? message.author.id.toString()
            : message.author.id
        }>
         ${ARROW} Item: ${item}
         ${ARROW} Amount: ${howmuch}
       `.replace(/ {2,}/g, "")
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(FOOTER);
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
