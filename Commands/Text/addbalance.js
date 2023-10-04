const {
  Owner,
  Admin,
  WL,
  Prefix,
  BGL,
  DL,
  VERIF,
  BOT,
  ARROW,
  HISTORY,
  FOOTER,
  TITLE,
  LOADING,
  NO,
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
  name: `${ARROW} ${Prefix}addbalance **[GrowID Want To Add]** **[Balance To Add]**`,
  aliases: ["addbal", "addmoney", "ab", "am"],
  description: "To Add Balance Or Money",
  usage: "[GrowID Want To Add] [Balance To Add]",
  accessableby: "admin",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply(
        `${NO} | Cuman Admin & Owner Yang Bisa Menggunakan Command`
      );
    if (!args[0])
      return message.channel
        .send({ content: `${LOADING} | Cantumkan GrowID yang ditambahkan??` })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch();
    let growId = args[0].toLowerCase();
    if (!args[1] || isNaN(args[1]))
      return message.reply(`${LOADING} | Berapa ${WL} yang ingin ditambahkan?`);

    let Balance = args[1];
    let wallet1 = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));

    if (!wallet1) return message.reply(`${NO} | GrowID Tidak Terdaftar`);
    await Bal.updateOne({ GrowID: growId }, { $inc: { Balance: Balance } });

    let wallet = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        return d.Balance;
      })
      .catch(console.error);
    let bgl = Math.floor(parseFloat(wallet) / 10000);
    let dl = Math.floor((parseFloat(wallet) % 10000) / 100);
    let wl = Math.round((parseFloat(wallet) % 10000) % 100);
    const addbal = new MessageEmbed()
      .setTitle("Tambah Balance")
      .setDescription(`${WL} **| Total Balance :** \n${wallet}`)
      .addField(`${BGL} | Blue Gem Lock`, `${bgl}`)
      .addField(`${DL} | Diamond Lock`, `${dl}`)
      .addField(`${WL} | World Lock`, `${wl}`)
      .setTimestamp()
      .setFooter(`${FOOTER}`)
      .setColor("RANDOM");
    message.channel.send({
      content: `${VERIF} Success | ${Balance} ${WL} Balance Added To ${growId}`,
    });
    message.channel.send({ embeds: [addbal] });
    const sendToOwner = new MessageEmbed()
      .setTitle(`${HISTORY} | Tambah Uang History`)
      .setDescription(
        `
         ${BOT} User: <@${wallet1.DiscordID}>
         ${BOT} Admin: <@${
          message.author.id?.toString()
            ? message.author.id.toString()
            : message.author.id
        }>
         ${ARROW} Amount: ${Balance} ${WL}
       `.replace(/ {2,}/g, "")
      )
      .setTimestamp()
      .setColor("RANDOM")
      .setFooter(`${FOOTER}`);
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
