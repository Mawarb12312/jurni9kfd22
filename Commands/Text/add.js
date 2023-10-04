const shop = require("../../utils/schema/shop.js");
const list = require("../../utils/schema/list.js");
const fs = require("fs");
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
const request = require("request");
const path = require("path");
const filePath = path.join(__dirname, "Data", "data.js");

module.exports = {
  name: `${ARROW} ${Prefix}add **[Kode Produk]** **[Data Produk]** -- Tambah stok produk`,
  aliases: ["addstock"],
  description: "Add Stock Item",
  accessableby: "admin",
  usage: "[Code] [Data](Can Add More Than 1)",
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(`${LOADING} | Kode produk apa yang mau ditambah?`);
    const code = args.shift();
    const getCode = await list
      .find({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length < 1)
      return message.reply(
        `${NO} | Kode produk tidak ditemukan, silahkan gunakan .stock`
      );
    if (message.attachments.size > 0) {
      message.attachments.forEach((att) => {
        if (code.includes("script")) {
          request(att.url, async (err, res, body) => {
            if (err) return console.error(err);
            const script = body;
            await new shop({
              code: code,
              data: script,
            })
              .save()
              .then(console.log)
              .catch(console.error);
            message.reply("Script Added");
          });
        } else {
          request(att.url, async (err, res, body) => {
            if (err) return console.error(err);
            const items = body.split(/[\n\r\s]+/);
            if (items.length == 0)
              return message.reply(`${NO} | Tidak ada item disana`);
            for (let item of items) {
              await new shop({
                code: code,
                data: item,
              })
                .save()
                .then(console.log)
                .catch(console.error);
            }
            message.reply(`${VERIF} | Item produk berhasil ditambahkan`);
          });
        }
      });
    } else {
      if (!args[0])
        return message.reply(
          `${LOADING} | Item produk apa yang mau ditambahkan?`
        );
      const items = args;

      items.forEach(async (item) => {
        await new shop({
          code: code,
          data: item,
        })
          .save()
          .then(console.log)
          .catch(console.error);
      });
      message.reply(`${VERIF} | Item produk berhasil ditambahkan`);
    }
  },
};
