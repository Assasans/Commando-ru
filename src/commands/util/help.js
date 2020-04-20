const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');
const { Util } = require('discord.js');

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

	async run(message, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, message);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Команда **\`${commands[0].name}\`**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Только на серверах)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Формат:** ${message.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
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
					messages.push(await message.channel.send(`${message.author.toString()}`, {
						embed: {
							title: 'Список доступных команд',
							color: 0x1976d2,
							description: help
						}
					}));
				} catch(error) {
					messages.push(await message.reply(oneLine`
						Не удалось отпраить сообщение с подробной информацией про команду.
					`));
				}
				return messages;
			} else if(commands.length > 15) {
				return message.reply('Найдено несколько команд. Пожалуйста, укажите более точное название.');
			} else if(commands.length > 1) {
				return message.reply(disambiguation(commands, 'commands'));
			} else {
				return message.reply(
					`Не удалось найти команду. Напишите ${message.usage(
						null, message.channel.type === 'dm' ? null : undefined, message.channel.type === 'dm' ? null : undefined
					)}, чтобы посмотреть список доступных команд.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await message.author.send(undefined, {
					embed: {
						title: 'Список доступных команд',
						color: 0x1976d2,
						description: stripIndents`
							${oneLine`
								Для того, чтобы выполнить команду на ${message.guild ? message.guild.name : 'любом сервере'},
								напишите
								${Command.usage('command', message.guild ? message.guild.commandPrefix : null, this.client.user)}.
								Например:
								${Command.usage('prefix', message.guild ? message.guild.commandPrefix : null, this.client.user)}.
							`}
							${oneLine`
								Для того, чтобы выполнить команду в ЛС - просто напишите
								${Command.usage('command', null, null)} (без префикса).
							`}
		
							Напишите ${this.usage('<команда>', message.guild ? message.guild.commandPrefix : null, this.client.user)}
							для того, чтобы посмотреть подробую информацию про команду.
							${oneLine`
								Напишите ${this.usage('all', message.guild ? message.guild.commandPrefix : null, this.client.user)}
								для того, чтобы посмотреть список
								__всех__ команд, а не только доступных вам.
							`}
							
							${oneLine`
								**${showAll ? 'Список всех команд' : `Список команд доступных
								${message.guild ? `на сервере __${message.guild}__` : 'в этом ЛС'}`}**
							`}
						`
					}
				}));
				if(message.channel.type !== 'dm') {
					messages.push(await message.channel.send(`${message.author.toString()}`, {
						embed: {
							title: 'Список доступных команд',
							color: 0x1976d2,
							description: stripIndents`
								Сообщение со списком доступных команд отправлено вам в личные сообщения.
								${this.client.commandsLink ?
									`Также можете посмотреть список команд на сайте <${this.client.commandsLink}>` : ''
								}
							`
						}
					}));
				}
				Util.splitMessage(groups
					.filter(group => group.commands.some(command =>
						!command.hidden &&
						command.groupID !== 'hidden' &&
						(showAll || command.isUsable(message))
					))
					.map(group => stripIndents`
						__${group.name}__
						${group.commands
							.filter(command =>
								!command.hidden &&
								command.groupID !== 'hidden' &&
								(showAll || command.isUsable(message))
							)
							.map(command => `**${command.name}:** ${command.description}${command.nsfw ? ' (NSFW)' : ''}`).join('\n')
						}
					`)
				).forEach(async block => {
					messages.push(await message.author.send(undefined, {
						embed: {
							title: 'Список доступных команд',
							color: 0x1976d2,
							description: stripIndents`				
								${block}
							`
						}
					}));
				});
			} catch(error) {
				messages.push(await message.channel.send(`${message.author.toString()}`, {
					embed: {
						title: 'Ошибка',
						color: 0xd32f2f,
						description: oneLine`
							Не удалось отпраить личное сообщение с списком команд.
							Возможно у вас отключены личные сообщения от участников сервера.
						`
					}
				}));
			}
			return messages;
		}
	}
};
