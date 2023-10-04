const Bal = require("../../utils/schema/balance.js");
const { MessageEmbed } = require("discord.js");
const {
  COLOR,
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
    name: `${ARROW} ${Prefix}leaderboard -- To show top 10 most balance`,
    aliases: ["top", "lb"],
    description: "Shows Top 10 Most Balances",
    accessableby: "everyone",
    usage: "",
    run: async (client, message, args) => {
    let Data = ""
    await Bal.find({})
        .sort({ Balance: -1 })
        .limit(10)
        .then(data => {
            data.forEach((d, index) => {
               console.log(index)
               console.log(d.GrowID + "\n" + d.DiscordID)
               console.log(d.Balance)
               Data += `${index + 1}. ${d.GrowID} (${d.DiscordID}): ${d.Balance}\n`
            })
        })
        console.log(Data)
        const embed = new MessageEmbed()
            .setTitle("Leaderboard")
            .setDescription(`${Data}`)
            .setTimestamp()
            .setImage(imageUrl)
            .setColor("RANDOM")
        message.channel.send({ embeds: [embed] })
    }
}