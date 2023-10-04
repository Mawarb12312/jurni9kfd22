const mt = require("../../utils/schema/mt.js");
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
  name: `${ARROW} ${Prefix}setmt - Membuat bot dalam keadaan Maintenance`,
  aliases: ["mt"],
  accessableby: "admin",
  description: "To Set Maintenance Mode",
  usage: "",
  run: async (client, message, args) => {
    await mt
      .findOne({})
      .then(async (d) => {
        if (d) {
          d.mt = !d?.mt;
          await d
            .save()
            .then((d1) => {
              message.reply(
                d?.mt
                  ? `${NO} | Uppsss, bot still Maintenance`
                  : `${UP} | The bot already on`
              );
            })
            .catch(console.error);
        } else {
          await new mt({ mt: !d?.mt })
            .save()
            .then((d) => {
              message.reply(
                d?.mt
                  ? `${NO} | Uppsss, bot still Maintenance`
                  : `${UP} | The bot already on`
              );
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  },
};
