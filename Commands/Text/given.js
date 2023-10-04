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
  TITLE,
  LOADING,
  NO,
  BGL,
  DL,
  MONEY,
} = require("../../config.json");
const Bal = require("../../utils/schema/balance.js");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: `${ARROW} ${Prefix}give **[GrowID yang mau ditambah]** **[Jumlah uang untuk ditambah]**`,
  aliases: ["gv"],
  description: "To Add Balance Or Money",
  usage: "[GrowID yang mau ditambah] [Jumlah uang untuk ditambah]",
  accessableby: "admin",
  run: async (client, message, args) => {
    if (!args[0])
      return message.channel
        .send({ content: `${LOADING} **| GrowID yang ingin ditambah?**` })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch();
    let growId = args[0].toLowerCase();
    if (!args[1] || isNaN(args[1]))
      return message.reply(`${LOADING} **| Jumlah uang yang ingin ditambah?**`);

    let Balance = args[1];
    let wallet1 = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));

    if (!wallet1)
      return message.reply(
        `${NO} **| GrowID tidak ditemukan, silahkan re-check lagi**`
      );
    await Bal.updateOne({ GrowID: growId }, { $inc: { Balance: Balance } });

    let wallet = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        return d.Balance;
      })
      .catch(console.error);
    let bgl = Math.floor(parseFloat(wallet) / 10000);
    let dl = Math.floor((parseFloat(wallet) % 10000) / 100);
    let wl = Math.round((parseFloat(wallet) % 10000) % 100);

    const chanelid = "1154978993548832780";
    const chanel = message.guild.channels.cache.get(chanelid);

    //message.channel
    const addbal = new MessageEmbed()
      .setTitle(`${MONEY} | Add Balance`)
      .setDescription(
        `${VERIF} Success Adding ${Balance} ${WL} to ${growId}\n${MONEY} Update Balance <@${wallet1.DiscordID}> : ${wallet} ${WL}`
      )
      .setTimestamp()
      .setColor("RANDOM");
    chanel.send({
      embeds: [addbal]
    });

    const sendToOwner = new MessageEmbed()
      .setTitle(`${HISTORY} | Tambah Balance History`)
      .setDescription(
        `
         ${BOT} | User: <@${wallet1.DiscordID}>
         ${BOT} | Admin: <@${
          message.author.id?.toString()
            ? message.author.id.toString()
            : message.author.id
        }>
         ${MONEY} | Amount: ${Balance} ${WL}
       `.replace(/ {2,}/g, "")
      )
      .setTimestamp()
      .setFooter(`${FOOTER}`);
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
