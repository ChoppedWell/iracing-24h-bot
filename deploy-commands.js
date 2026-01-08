import { REST, Routes } from 'discord.js';
import fs from 'fs';
import config from './config.json' assert { type: 'json' }; // or use fs.readFileSync workaround



const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = '1458893923396354134';
const GUILD_ID = '1458882296118644910';

const commands = [];

// Load all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function deploy() {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}

deploy();
