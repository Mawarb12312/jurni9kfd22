const depo = require("../../utils/schema/depo.js");
const { MessageEmbed } = require("discord.js");
const dl = require("../../utils/schema/dl.js");
const {
  imageUrl,
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

module.exports = {
  name: `${ARROW} ${Prefix}depo -- To show deposit world`,
  aliases: ["world"],
  description: "Show World Deposit",
  accessableby: "everyone",
  usage: "",
  run: async (client, message, args) => {
    const deposit = await depo
      .findOne({})
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));
    const rateDl = await dl
      .findOne({})
      .then((res) => {
        return res?.Rate;
      })
      .catch(console.error);

    const embed = new MessageEmbed()
      .setTitle("Depo World")
      .setDescription(
        ARROW +
          " World: **" +
          (deposit?.world ? deposit.world : "Not Set Yet") +
          "**\n" +
          ARROW +
          " Owner: **" +
          (deposit?.owner ? deposit.owner : "Not Set Yet") +
          "**\n" +
          ARROW +
          " Bot Name: **" +
          (deposit?.botName ? deposit.botName : "Not Set Yet") +
          "**\n\n" +
          ARROW +
          " Don't Forget to **set your growid** and **screenshot**"
      )
      .setColor("RANDOM")
      .setImage(imageUrl)
      .setFooter("If bot not online, don't forget to screenshot");
    message.reply({ embeds: [embed] });
  },
};
