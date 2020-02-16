const { stripIndents } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Проверяет задержку соединения бота с серверами Дискорда',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('Проверяем задержку...');
			return pingMsg.edit(stripIndents`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Ответ от серверов получен!\nЗадержка на стороне бота: ${pingMsg.createdTimestamp - msg.createdTimestamp} мс.
				${this.client.ping ? `\nЗадержка на стороне серверов Дискорда: ${Math.round(this.client.ping)} мс.` : ''}
			`);
		} else {
			await msg.edit('Проверяем задержку...');
			return msg.edit(stripIndents`
				Ответ от серверов получен!
				Задержка на стороне бота: ${msg.editedTimestamp - msg.createdTimestamp} мс.
				${this.client.ping ? `Задержка на стороне серверов Дискорда: ${Math.round(this.client.ping)} мс.` : ''}
			`);
		}
	}
};
