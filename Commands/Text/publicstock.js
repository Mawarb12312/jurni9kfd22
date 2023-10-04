const stock = require("../../utils/schema/stock.js");
const {
  Admin,
  Owner,
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
  name: `${ARROW} ${Prefix}publicstock -- Buat stock menjadi publik`,
  aliases: ["ps"],
  accessableby: "admin",
  description: "To Set Public Or Private Stock Commands",
  usage: "",
  run: async (client, message, args) => {
    await stock
      .findOne({})
      .then(async (d) => {
        if (d) {
          d.Public = !d?.Public;
          await d
            .save()
            .then((d1) => {
              message.reply(
                d?.Public
                  ? "Stock Commands Set To Public"
                  : "Stock Commands Set To Private"
              );
            })
            .catch(console.error);
        } else {
          await new stock({ Public: true })
            .save()
            .then((d) => {
              message.reply(
                d?.Public
                  ? "Stock Commands Set To Public"
                  : "Stock Commands Set To Private"
              );
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  },
};
