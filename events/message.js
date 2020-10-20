const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

module.exports = message => {
  let client = message.client;
  let prefix = ayarlar.prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
   if (client.commands.has(command.toLowerCase())) {
    cmd = client.commands.get(command.toLowerCase());
  } else if (client.aliases.has(command.toLowerCase())) {
    cmd = client.commands.get(client.aliases.get(command.toLowerCase()));
  }
  if (cmd) {

    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }

};


