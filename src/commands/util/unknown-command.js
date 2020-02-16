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

	run(msg) {
		return msg.reply(
			`Неизвестная команда. Напишите ${msg.anyUsage(
				'help',
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}, чтобы посмотреть список доступных команд.`
		);
	}
};
