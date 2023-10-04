const Bal = require("../../utils/schema/balance.js");
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
  name: `${ARROW} ${Prefix}set **[GrowID]** -- Set your GrowID`,
  aliases: ["register"],
  description: "Set GrowID",
  accessableby: "everyone",
  usage: "[GrowID]",
  run: async (client, message, args) => {
    if (!args[0])
      return message.channel
        .send({ content: `${LOADING} | What is your GrowID` })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch();
    let GrowID = args[0].toLowerCase();
    let user = message.author.id;
    let existingEntry = await Bal.findOne({ GrowID: GrowID })
      .then((d) => {
        return d.DiscordID;
      })
      .catch((e) => console.error(e));

    if (existingEntry && existingEntry !== user) {
      message.reply(`${NO} | Upppsss, the GrowID already taken by someone`);
    } else {
      const newData = {
        GrowID: GrowID,
        DiscordID: user,
        Balance: 0,
      };
      await Bal.findOneAndUpdate(
        { DiscordID: user },
        { $set: { GrowID: GrowID } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
        .then((res) => {
          console.log(res);
          message.reply(`${VERIF} | Succes set your GrowID`);
          message.reply(`${BOT} GrowID: \n` + ARROW + " " + res.GrowID);
        })
        .catch((e) => console.error(e));
    }
  },
};
