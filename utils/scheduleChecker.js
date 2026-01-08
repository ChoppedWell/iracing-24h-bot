import fetch from "node-fetch";
import fs from "fs";
import { DateTime } from "luxon";
import { EmbedBuilder } from "discord.js";


const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));


export default async function checkSchedule(client) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/Plan!H3:AO100?key=${config.googleApiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.values) return;

  const now = DateTime.utc();
  const driverData = JSON.parse(
    fs.readFileSync("./data/extended_drivers.json", "utf-8")
  );

  const channel = client.channels.cache.find(
    (c) => c.name === config.reminderChannel
  );
  if (!channel) return;

  for (const row of json.values) {
    const utcTimeRaw = row[0];
    const driverName = row[47];
    if (!utcTimeRaw || !driverName || !driverData[driverName]) continue;

    const stintTime = DateTime.fromISO(utcTimeRaw, { zone: "utc" });
    const diff = stintTime.diff(now, "minutes").minutes;

    if (Math.abs(diff - 30) < 1 || Math.abs(diff - 10) < 1) {
      const { id, timezone } = driverData[driverName];
      const localTime = stintTime.setZone(timezone).toFormat("HH:mm ZZZZ");

      const embed = new EmbedBuilder()
        .setTitle("⏱️ Stint Reminder")
        .setDescription(`<@${id}>, your stint is in **${Math.round(diff)}m**`)
        .addFields({ name: "Local Time", value: localTime });

      await channel.send({ embeds: [embed] });
    }
  }
}
