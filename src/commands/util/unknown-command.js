const Command = require('../base');

module.exports = class UnknownCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unknown-command',
			group: 'util',
			memberName: 'unknown-command',
			description: 'Отображает ошибку, когда выполнена неизвестная команда.',
			examples: ['unknown-command this-command-does-not-exists'],
			unknown: true,
			hidden: true
		});
	}

	run(message) {
		return message.channel.send(`${message.author.toString()}`, {
			embed: {
				title: 'Ошибка',
				color: 0xd32f2f,
				description: `Неизвестная команда. Напишите ${message.anyUsage(
					'help',
					message.guild ? undefined : null,
					message.guild ? undefined : null
				)}, чтобы посмотреть список доступных команд.`
			}
		});
	}
};
