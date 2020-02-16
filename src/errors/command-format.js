const FriendlyError = require('./friendly');

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
class CommandFormatError extends FriendlyError {
	/**
	 * @param {CommandoMessage} msg - The command message the error is for
	 */
	constructor(msg) {
		super(
			`Неверное использование команды. Фонмат аргументов для команды \`${msg.command.name}\`: ${msg.usage(
				msg.command.format,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}. Напишите ${msg.anyUsage(
				`help ${msg.command.name}`,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} для подробной информации.`
		);
		this.name = 'CommandFormatError';
	}
}

module.exports = CommandFormatError;
