const Discord = require('discord.js');
const moment = require('moment');
const data = require('quick.db');
const ayarlar = require('/app/ayarlar.json');

moment.locale('tr')

exports.run = (client, message, args) => {

 let yetkili = ayarlar.registrar
 let kız = ayarlar.kız
 let rebel = ayarlar.rebel
 let kayıtsız = ayarlar.kayıtsız
 let log = client.channels.get(ayarlar.log_channel)

 let isim = args[1]
 let yaş = args[2]
 let üye = message.mentions.members.first() || message.guild.members.get(args[0])
 let olacak_isim = `${ayarlar.tag} ${isim} | ${yaş}`

let yetkin_yok = new Discord.RichEmbed()
.setTitle('Yeterli Yetkin Bulunmuyor.')
.setDescription(`Bu komutu kullanabilmek için <@&${yetkili}> rolüne sahip olmanız gerekiyor.`)
.setColor('RED')
.setFooter(message.guild.name)
.setTimestamp()

let üye_belirtmedin = new Discord.RichEmbed()
.setTitle('Üye Belirtmeyi Unuttun.')
.setDescription(`Kayıt edeceğim kişiyi belirtmeyi unuttunuz.`)
.setColor('RED')
.setFooter(message.guild.name)
.setTimestamp()

let isim_belirtmedin = new Discord.RichEmbed()
.setTitle('İsim Belirtmeyi Unuttun.')
.setDescription(`Kayıt edeceğim kişinin ismini belirtmeyi unuttunuz.`)
.setColor('RED')
.setFooter(message.guild.name)
.setTimestamp()

let yaş_belirtmedin = new Discord.RichEmbed()
.setTitle('Yaş Belirtmeyi Unuttun.')
.setDescription(`Kayıt edeceğim kişinin yaşını belirtmeyi unuttunuz.`)
.setColor('RED')
.setFooter(message.guild.name)
.setTimestamp()


if(!message.member.roles.has(yetkili)) return message.channel.send(yetkin_yok)

if(!üye) return message.channel.send(üye_belirtmedin)

if(!isim) return message.channel.send(isim_belirtmedin)
if(!yaş) return message.channel.send(yaş_belirtmedin)

data.add(`${message.author.id}.kayıt_sayısı_kız`, 1)
data.add(`${message.author.id}.kayıt_sayısı`, 1)
data.set(`${üye.id}.cinsiyet`, "Kız")
let kayıt_sayısı = data.get(`${message.author.id}.kayıt_sayısı`)

let mentionedUser = message.mentions.users.first() || message.author;

message.channel.send(
new Discord.RichEmbed()
.setThumbnail(mentionedUser.displayAvatarURL)
.setTitle('<a:teb:767133944054415410>  İşte Bu Kadar!')
.setDescription(`${üye} adlı kullanıcına <@&765952482596618240> rolü veridi.`)
.setColor('GREEN')
.setTimestamp())

üye.addRole(kız).then(üye.removeRole(kayıtsız))
üye.addRole(rebel).then(üye.removeRole(kayıtsız))
üye.setNickname(olacak_isim)

log.send(
new Discord.RichEmbed()
.setTitle('Bir Kullanıcı Kayıt Edildi!')
.setDescription(`Bir kullanıcı <@&${kız}> olarak kayıt edildi. Kayıt eden yetkili toplam **${kayıt_sayısı}** kişiyi kayıt etmiş. Toplam **${kayıt_sayısı}** kişiyi kayıt ettin`)
.addField('» Kayıt Eden Yetkili:', `\`Kullanıcı İsmi   :\` _${message.author.tag}_\n\`Kimlik Numarası  :\` _${message.author.id}_`)
.addField('» Kayıt Edilen Üye:', `\`Kullanıcı İsmi   :\` _${üye.user.tag}_\n\`Şimdiki İsmi  :\` _${isim}_ _|_ _${yaş}_\n\`Kimlik Numarası  :\` _${üye.id}_`)
.addField('» Kayıt Tarihi:', `\`${moment().format('Do MMMM YYYY - HH:mm:ss')}\``)
.setColor('GREEN')
.setFooter(message.guild.name)
.setTimestamp()
  )
};
 
exports.conf = {
enabled: true,
guildOnly: true,
aliases: ["woman", "bayan", "k", "kadın"],
permLevel: 0
};
 
exports.help = {
name: 'kız'
};
