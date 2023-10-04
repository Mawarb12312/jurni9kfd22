const dl = require("../../utils/schema/dl.js");
const {
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
  name: `${ARROW} ${Prefix}ratedl - Mengatur harga DL`,
  aliases: ["setratedl"],
  description:
    "To Set Rate DL For Saweria (U Must Set Rate DL If U Want Accept Payment Using Saweria)",
  usage: "[Rate DLs In Rp]",
  accessableby: "admin",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply("What Rate?");
    const rateDl = Number(args[0]);
    if (!rateDl) return message.reply("Only Use Number!");

    await dl.findOneAndUpdate(
      { },
      { $set: { Rate: rateDl } },
      { upsert: true, new: true }
    )
      .then((res) => {
        console.log(res);
        message.reply("Succes Set Rate DLs To " + rateDl);
      })
      .catch((e) => console.error(e));
  },
};
