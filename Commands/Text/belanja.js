const shop = require("../../utils/schema/shop.js");
const list = require("../../utils/schema/list.js");
const {
  imageUrl,
  roleBuyer,
  channelTesti,
  Owner,
  WL,
  COLOR,
  Prefix,
  UP,
  DOWN,
  VERIF,
  BOT,
  ARROW,
  HISTORY,
  FOOTER,
  TITLE,
  LOADING,
  NO,
  MONEY,
  DL,
} = require("../../config.json");
const Bal = require("../../utils/schema/balance.js");
const Price = require("../../utils/schema/price.js");
const order = require("../../utils/schema/order.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}belanja **[Code Product]** **[Amount Product to buy]**`,
  aliases: ["buy", "beli", "claim"],
  description: "Buy Item",
  accessableby: "everyone",
  usage: "[Item Code] [Jumlah] (Optional, Default 1)",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(`${LOADING} | What product would you buy?`);
    let item = args[0];

    const getCode = await list
      .findOne({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (!getCode)
      return message.reply(`${NO} | Code Product Not Found, use .stock`);
    let howmuch = args[1] ? Number(args[1]) : 1;
    if (howmuch < 1) return message.reply(`${NO} | Don't use the bug!`);
    if (isNaN(howmuch))
      return message.reply(`${NO} | Please use number for amount product`);
    const user = message.author;
    const member = message.guild.members.cache.get(user.id);
    let getBal = await Bal.findOne({ DiscordID: user.id })
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));
    if (!getBal)
      return message.reply(
        `${NO} | Please register your growid first, do .set [growid]`
      );
    let wallet = getBal.Balance;
    let price = await Price.findOne({ code: item })
      .then((d) => {
        console.log(d);
        return d?.price;
      })
      .catch((e) => console.error(e));
    if (!price)
      return message.reply(
        `${LOADING} | Ooops owner forget to set the price, tag owner` + item
      );

    const data = await shop
      .find({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    console.log(price);

    if (data.length == 0)
      return message.reply(
        `${NO} | Sorry the product out of stock, it will restock soon`
      );
    console.log("Amount :", howmuch);
    console.log("Stock :", data.length);
    if (Number(data.length) < Number(howmuch))
      return message.reply(`${NO} | Not That Much Stock, use .stock`);
    price = Number(price) * Number(howmuch);
    console.log(price);
    if (wallet < price)
      return message.reply(
        `${NO} | Upsss, your money less then` +
          price +
          `\nDo .depo to add your money`
      );
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
        .setTitle(`${VERIF} | Purchase was Successfull`)
        .setDescription(
          "Purchase was successfull\nYou've successfully purchased " +
            item +
            " for " +
            price +
            WL +
            "\nDon't forget to give reps, in #channel"
        )
        .setImage(imageUrl)
        .setColor("RANDOM")
        .setFooter(`${FOOTER}`);
      user.send({
        files: [
          {
            attachment: Buffer.from(sending),
            name: `Farhan Store_` + message.author.id + `.txt`,
          },
        ],
        embeds: [doneBuy],
      });
      client.users.send(Owner, {
        files: [
          {
            attachment: Buffer.from(sending),
            name: `Farhan Store_` + message.author.id + `.txt`,
          },
        ],
      });
      message.reply(`${VERIF} Success Sent | Please Check your DM `);
    } catch (e) {
      message.reply(
        `${LOADING} Please turn on your DM Messages and contact owner to get your order`
      );
      client.users.send(Owner, {
        content: "This Is Error <@" + message.author.id + "> Order",
        files: [
          {
            attachment: Buffer.from(sending),
            name: `Farhan Store_` + message.author.id + `.txt`,
          },
        ],
      });
    }
    await Bal.updateOne(
      { DiscordID: user.id },
      { $inc: { Balance: -Number(price) } }
    )
      .then((d) => {
        console.log(d);
      })
      .catch((e) => console.error(e));

    if (!member.roles.cache.some((r) => r.id == roleBuyer)) {
      member.roles.add(roleBuyer);
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
    const testi = new MessageEmbed()
      .setTitle("#Order Number: " + orderN)
      .setDescription(
        ARROW +
          "Pembeli: **<@" +
          user.id +
          ">**\n" +
          ARROW +
          "Produk: **" +
          howmuch +
          " " +
          (itemName || "IDK Name") +
          "**\n" +
          ARROW +
          " Total Price: **" +
          price +
          WL +
          ` **\n**${VERIF} | Verified Purchase**`
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setImage(imageUrl)
      .setFooter("Testimoni");
    const ch = client.channels.cache.get(channelTesti);
    ch.send({ embeds: [testi] });
    const sendToOwner = new MessageEmbed()
      .setTitle(`${HISTORY} | Pembelian History`)
      .setDescription(
        `
         ${BOT} Buyer: <@${
          message.author.id?.toString()
            ? message.author.id.toString()
            : message.author.id
        }>
         ${ARROW} Item: ${item}
         ${MONEY} Amount: ${howmuch} ${WL}
       `.replace(/ {2,}/g, "")
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(`${FOOTER}`);
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
