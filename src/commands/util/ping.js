const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Проверяет задержку соединения от бота с серверам Дискорда',
			throttling: {
				usages: 2,
				duration: 5
			}
		});
	}

	async run(msg) {
		const pingMsg = await msg.reply('Проверяем задержку...');
		return pingMsg.edit(oneLine`
			${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
			Ответ от серверов получен!\nЗадержка на стороне бота: ${
				(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp)
			} мс.
			${this.client.ws.ping ? `\nЗадержка в WebSocket соединении: ${Math.round(this.client.ws.ping)} мс.` : ''}
		`);
	}
};
