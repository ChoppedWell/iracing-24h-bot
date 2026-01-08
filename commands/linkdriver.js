import fs from "fs";
import path from "path";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("linkdriver")
    .setDescription("Link a driver name to a Discord user & timezone")
    .addStringOption((opt) =>
      opt.setName("name").setDescription("Driver name").setRequired(true)
    )
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Discord user").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("timezone").setDescription("Time zone").setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const user = interaction.options.getUser("user");
    const timezone = interaction.options.getString("timezone");

    const filePath = path.join("./data/extended_drivers.json");
    let data = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    data[name] = { id: user.id, timezone };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    await interaction.reply(
      `Linked driver **${name}** → <@${user.id}> (${timezone})`
    );
  },
};
