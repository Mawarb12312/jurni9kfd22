const { MessageEmbed } = require("discord.js");
const shop = require("../../utils/schema/shop.js");
const Price = require("../../utils/schema/price.js");
const list = require("../../utils/schema/list.js");
const {
  roleBuyer,
  channelTesti,
  Owner,
  imageUrl,
  COLOR,
  Admin,
  channelIdStock,
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
const stock = require("../../utils/schema/stock.js");

module.exports = {
  name: `${ARROW} ${Prefix}stock -- To show product stock`,
  aliases: ["check"],
  description: "Check Stock",
  accessableby: "everyone",
  usage: "",
  run: async (client, message, args) => {
    const stockAccess = await stock
      .findOne({})
      .then((d) => {
        return d?.Public;
      })
      .catch(console.error);
    if (!stockAccess) {
      if (
        !message.author.bot &&
        !Admin.includes(message.author.id) &&
        message.author.id !== Owner
      )
        return message.reply(`U Can Check Stock At <#${channelIdStock}>`);
    }
    const getCodes = await list
      .find({})
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCodes.length < 1) {
      return message.reply(
        `${LOADING} | Upsss, Owner forget to add product and stock, tag owner to add product`
      );
    }
    let text = "";
    for (let i = 0; i < getCodes.length; i++) {
      const code = getCodes[i];
      console.log(code.code);
      const stock = await shop
        .find({ code: code.code })
        .then((res) => {
          return res;
        })
        .catch(console.error);
      const price = await Price.findOne({ code: code.code })
        .then((res) => {
          console.log(res);
          return res;
        })
        .catch(console.error);
      text += `**----------------------------**
            ${ARROW} Name   : **${code.name}**
            ${ARROW} Code   : **${code.code}**
            ${ARROW} Stock  : **${stock.length > 0 ? stock.length : `${NO}`}**
            ${MONEY} Price  : **${price ? price.price : `${NO}`} ${WL}**
            `.replace(/ {2,}/g, "");
    }
    const send = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${BGL} **PRODUCT LIST** ${BGL}`)
      .setTimestamp()
      .setFooter(`${FOOTER}`)
      .setImage(imageUrl)
      .setDescription(
        `${UP} Stock product from Farhan Store` + `\n` + `${text}`
      );
    message.channel.send({ embeds: [send] });
  },
};
