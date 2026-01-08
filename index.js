import { Client, GatewayIntentBits, Collection } from "discord.js";
import path from "path";
import checkSchedule from "./utils/scheduleChecker.js";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));


const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();

const commandsPath = path.join("./commands");
for (const file of fs.readdirSync(commandsPath)) {
  if (file.endsWith(".js")) {
    const { default: cmd } = await import(`./commands/${file}`);
    client.commands.set(cmd.data.name, cmd);
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  setInterval(() => checkSchedule(client), 60000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "Error executing.", ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
