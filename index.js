const { Client, Collection, Intents, Discord, MessageEmbed } = require("discord.js");
let db = require('inflames.db')
const client = global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});
const dotenv = require("dotenv");
dotenv.config();
const { readdir } = require("fs");
require("moment-duration-format");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
client.cooldown = new Map();
client.commandblocked = [];

require("./src/helpers/function")(client);

readdir("./src/commands/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./src/commands/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let prop = require(`./src/commands/${f}/` + file);
        console.log(`[SLAVANİA-COMMAND] ${prop.name} yüklendi!`);
        commands.set(prop.name, prop);
        prop.aliases.forEach(alias => {
          aliases.set(alias, prop.name);
        });
      });
    });
  });
});

readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let prop = require(`./src/events/${file}`);
    if (!prop.conf) return;
    client.on(prop.conf.name, prop);
    console.log(`[SALVANİA - YÜKLENDİ] ${prop.conf.name} yüklendi!`);
  });
});
const cnf = require('./config.json') 
client.login(cnf.bot.token)
  .then(() => console.log(`Bot ${client.user.username} olarak giriş yaptı!`))
  .catch((err) => console.log(`Bot Giriş yapamadı sebep: ${err}`));



  client.on('messageCreate', async message => {
    if (message.content === 'bl!fakeayrıl') { // Buraya ne yazarsanız yazdığınız şeye göre çalışır
      client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
        }
    if (message.content === 'bl!fakekatıl') { // Buraya ne yazarsanız yazdığınız şeye göre çalışır
      client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
        }
      });


      
  let invitelog = cnf.bot.invitelog
      client.on("memberJoin", async(member, invite, inviter, guild) => {
        guild.channels.cache.get(invitelog).send(`${member} sunucumuza katıldı, Davet Eden: **${inviter.username}**.`);
    })
    
    client.on("memberLeave", async(member, invite, inviter, guild) => {
        guild.channels.cache.get(invitelog).send(`${member.user.tag} Sunucumuzdan Ayrıldı, Davet eden: **${inviter}**.`);
    })
  