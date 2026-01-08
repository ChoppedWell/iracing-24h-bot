import { REST, Routes } from 'discord.js';
import fs from 'fs';

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = '1458893923396354134';
const GUILD_ID = '1458882296118644910';

// Load commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log(`Registering ${commands.length} slash commands...`);
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log('Slash commands registered successfully.');
} catch (error) {
  console.error(error);
}
