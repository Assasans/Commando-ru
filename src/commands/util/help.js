const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Показвыает список доступных команд или подробную информацию про команду.',
			details: oneLine`
				Аргумент может быть названием (частичным или полным) команды.
				Если команда не указана - будет выведен список всех доступных вам команд.
			`,
			examples: ['help', 'help prefix'],
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Для какой команды вы хотите посмотреть подробную информацию?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Команда **\`${commands[0].name}\`**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Только на серверах)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Формат:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Альтернативные названия:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Группа:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Подробная информация:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Примеры выполнения:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') {
						messages.push(await msg.reply(oneLine`
							Успешно отправлено личное сообщение с подробной информацией про команду.
						`));
					}
				} catch(err) {
					messages.push(await msg.reply(oneLine`
						Не удалось отпраить личное сообщение с подробной информацией про команду.
						Возможно у вас отключены ЛС от участников сервера.
					`));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Найдено несколько команд. Пожалуйста, укажите более точное название.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Не удалось распознать команду. Напишите ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)}, чтобы посмотреть список доступных команд.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						Для того, чтобы выполнить команду на ${msg.guild ? msg.guild.name : 'любом сервере'},
						напишите ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						Например: ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					${oneLine`
						Для того, чтобы выполнить команду в ЛС - просто напишите
						${Command.usage('command', null, null)} (без префикса).
					`}

					Напишите ${this.usage('<команда>', null, null)} для того, чтобы посмотреть подробую информацию про команду.
					${oneLine`
						Напишите ${this.usage('all', null, null)} для того, чтобы посмотреть список
						__всех__ команд, а не только доступных вам.
					`}

					${oneLine`
						**${showAll ? 'Список всех команд' : `Список команд доступных
						${msg.guild ? `на сервере __${msg.guild}__` : 'в этом ЛС'}`}**
					`}

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') {
					messages.push(await msg.reply(oneLine`
						Успешно отправлено личное сообщение со списком доступных команд.
					`));
				}
			} catch(err) {
				messages.push(await msg.reply(oneLine`
					Не удалось отпраить личное сообщение с списком команд.
					Возможно у вас отключены ЛС от участников сервера.
				`));
			}
			return messages;
		}
	}
};
