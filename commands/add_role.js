function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}


module.exports = {
	name: 'add_role',
	description: 'Add roles to ',
	execute(message, args) {
        if(args.length<2){
            return message.channel.send("コマンドの引数が足りません。")
        }
        const target_role=getUserFromMention(args[0]);
        const conditions
        if (!user) {
            return message.reply('error');
        }
        

		message.channel.send('Pong.');
	},
};