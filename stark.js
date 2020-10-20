  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Modüller Ve Benzeri ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
const Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const prefix = ayarlar.prefix;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Modüller Ve Benzeri ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Değişken - 0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
let tag = ayarlar.tag
let sunucu_id = ayarlar.sunucu_id
let family = ayarlar.family

let register_chat = client.channels.get(ayarlar.register_chat)
let log_channel = client.channels.get(ayarlar.log_channel)

let kayıtsız = ayarlar.kayıtsız
let registrar = ayarlar.registrar
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Değişken - 0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Hoşgeldin Mesajı/Fake Hesap Koruması - 2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
client.on('guildMemberAdd', async member => {
  await member.addRole(`766358553786712104`) //id yazan yere verilecek rol (unregistered)
let member2 = member.user 
let zaman = new Date().getTime() - member2.createdAt.getTime()
var user = member2 
var takizaman = [];
if(zaman < 604800000) {
takizaman = '<a:teh:767134114376581181>  Tehlikeli'
} else {
takizaman = `<a:guv:767133941454864404>  Güvenli`}require("moment-duration-format");
 let zaman1 = new Date().getTime() - user.createdAt.getTime()
 const gecen = moment.duration(zaman1).format(` YY [Yıl,] DD [Gün,] HH [Saat,] mm [Dakika,] ss [Saniye]`) 
 let dbayarfalanfilan = await db.fetch(`takidbayar${member.guild.id}`)
 let message = member.guild.channels.find(x => x.id === `765284004802068530`) //id yazan kısma kanal id'si [orn: register-chat]
  const taki = new Discord.RichEmbed()
 .setTitle(
     "**Rebel Community Sunucusuna Hoş Geldin**"
   
   )
   .setDescription(`<a:tr:767133939625099264> **・** **Hoş geldin** ${member} 
   
<a:2_:767133946957266985>**・**Seninle Beraber** ${message.guild.memberCount} **Kişiyiz**

<a:1_:767133963403264044>**・**Kaydının Yapılması İçin Bir Ses Kanalına Geçiniz**

<a:tk:767133939470565388>**  ・**<@&765953027383230474> **Yetkisine Sahip Olan Kişiler Senin İle İlğilenecektir**

<a:sonsuz:767133938967117865>**.**Hesap Açılalı** ${gecen} **Olmuş**

<a:elmas:767133943987175454>**・**Bu Kullanıcı**:** **${takizaman}
`)
.setColor('BLACK')
.setImage('https://cdn.discordapp.com/attachments/713860783037218946/767139743900762122/giphy.gif')
message.send(taki)
 
         });

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Hoşgeldin Mesajı/Fake Hesap Koruması - 2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Command ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Command ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Perm ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.owner) permlvl = 4;
  
    return permlvl;
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Perm ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Other ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Other ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
