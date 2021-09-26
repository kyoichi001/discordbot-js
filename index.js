const fs = require('fs');
//requireはサーバーサイド側の書き方
//import はフロントのみ
const Discord  = require('discord.js');
const Config=require('./private_content/config.json')
const client = new Discord.Client({
   intents: [
     Discord.Intents.FLAGS.GUILDS
    ] 
  })
client.commands = new Discord .Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`${client.user.tag} でログインしています。`)
})

client.on('message', async msg => {
  if (msg.content === '!ping') {
    msg.channel.send('Pong!')
  }
})

client.login(Config.token)