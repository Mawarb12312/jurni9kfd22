const { MessageEmbed } = require("discord.js");
const {
  Owner,
  Admin,
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
  name: `${ARROW} ${Prefix}help -- To help you navigate`,
  aliases: ["h"],
  description: "Help Command",
  usage: `[Command Name] (Optional)`,
  accessableby: "everyone",
  run: async (client, message, args) => {
    if (!args[0]) {
      const publicCmds = [];
      const adminCmds = [];

      client.commands.forEach((command) => {
        const cmdString = `${command.name}`;
        if (command.accessableby === "everyone") {
          publicCmds.push(cmdString);
        } else if (command.accessableby === "admin") {
          adminCmds.push(cmdString);
        }
      });

      const publicCmdList = publicCmds.join("\n");
      const adminCmdList = adminCmds.join("\n");
      let text;
      if (
        !message.author.bot &&
        message.author.id !== Admin[0] &&
        message.author.id !== Admin[1] &&
        message.author.id !== Owner
      ) {
        text = "**Public Commands**\n" + publicCmdList;
      } else {
        text =
          `${VERIF} **Admin Commands**\n` + 
          adminCmdList +
          `\n\n${VERIF} **Public Commands**\n` +
          publicCmdList;
      }
      const help = new MessageEmbed()
        .setTitle(`${HISTORY} | Help Command`)
        .setDescription(text)
        .setFooter(`Using ${Prefix}help/[command name] for more help`)
        .setTimestamp()
        .setImage(imageUrl)
        .setColor("RANDOM");
      message.channel.send({ embeds: [help] });
    } else {
      const name = args[0].toLowerCase();
      const cmd =
        message.client.commands.get(name) ||
        message.client.commands.find(
          (c) => c?.aliases && c?.aliases?.includes(name)
        );
      const alias = cmd?.aliases ? cmd?.aliases : "No Aliases";

      if (!cmd)
        return message.reply(`${NO} | Sorry, But That Command Is Invalid`);

      const help1 = new MessageEmbed()
        .setTitle("Help Command For Command " + name)
        .addField("Name :", `${cmd.name}`)
        .addField("Description :", `${cmd.description}`)
        .addField("Usage :", `${cmd.name}`)
        .addField(
          "Alias : ",
          `${alias.length > 0 ? alias.join(", ") : "No Aliases"}`
        )
        .setTimestamp()
        .setColor("RANDOM");

      message.channel.send({ embeds: [help1] });
    }
  },
};
