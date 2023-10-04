const {
  Admin,
  Owner,
  Prefix,
  UP,
  DOWN,
  VERIF,
  BOT,
  HISTORY,
  FOOTER,
  TITLE,
  LOADING,
  NO,
  BGL,
  DL,
  MONEY,
} = require("../../config.json");
const { DateTime } = require("luxon");
const { MessageEmbed, WebhookClient } = require("discord.js");
const shop = require("../../utils/schema/shop.js");
const Price = require("../../utils/schema/price.js");
const list = require("../../utils/schema/list.js");
const { COLOR, ARROW, WL, imageUrl } = require("../../config.json");

module.exports = {
  name: `${ARROW} ${Prefix}setrt -- Untuk membuat real-time stock`,
  aliases: ["rt"],
  accessableby: "admin",
  description: "To Send Realtime Stock",
  usage: "",
  run: async (client, message, args) => {
    const channel = await message.channel.send({
      content: "**Sending Realtime Stock, Send Every 30s**",
    });
    setInterval(async () => {
      const getCodes = await list
        .find({})
        .then((res) => {
          return res;
        })
        .catch(console.error);
      if (getCodes.length < 1) return;
      let text = "";
      for (let i = 0; i < getCodes.length; i++) {
        const code = getCodes[i];
        const stock = await shop
          .find({ code: code.code })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        const price = await Price.findOne({ code: code.code })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        text += `
          **===========================**
          **<a:Kanm:1157916718522449980> ${code.name}**
          ${ARROW} Code: **${code.code}**
          ${ARROW} Stock: **${stock.length > 0 ? stock.length : "0"}**
          ${ARROW} Price: **${price ? price.price : "Not Set Yet"} ${WL}**
          `.replace(/ {2,}/g, "");
      }

      const jakartaTime = DateTime.now().setZone("Asia/Jakarta");
      const formattedTime = jakartaTime.toFormat("yyyy-MM-dd HH:mm:ss");

      console.log(`Waktu di Jakarta sekarang: ${formattedTime}`);

      let embed = new MessageEmbed()
        .setColor(COLOR)
        .setTitle(
          `<a:Turo:1157917493239762965> REALTIME STOCK <a:Turo:1157917493239762965>`
        )
        .setTimestamp()
        .setImage(imageUrl)
        .setFooter(`(${formattedTime})`)
        .setDescription(`${text}`);
      channel.edit({ embeds: [embed] });
    }, 30000);
  },
};
