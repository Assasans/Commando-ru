const fs = require('fs');
const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class LoadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			aliases: ['load-command'],
			group: 'commands',
			memberName: 'load',
			description: 'Загружает новую команду.',
			details: oneLine`
				Аргументом должно быть полное название команды в формате \`group:memberName\`.
				Только владельцы бота могу использовать эту команду.
			`,
			examples: ['load some-command'],
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'command',
					prompt: 'Какую команду вы хотите загрузить?',
					validate: val => new Promise(resolve => {
						if(!val) return resolve(false);
						const split = val.split(':');
						if(split.length !== 2) return resolve(false);
						if(this.client.registry.findCommands(val).length > 0) {
							return resolve('Данная команда уже зарегистрирована.');
						}
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						fs.access(cmdPath, fs.constants.R_OK, err => err ? resolve(false) : resolve(true));
						return null;
					}),
					parse: val => {
						const split = val.split(':');
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						delete require.cache[cmdPath];
						return require(cmdPath);
					}
				}
			]
		});
	}

	async run(msg, args) {
		this.client.registry.registerCommand(args.command);
		const command = this.client.registry.commands.last();

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						const cmdPath = this.registry.resolveCommandPath('${command.groupID}', '${command.name}');
						delete require.cache[cmdPath];
						this.registry.registerCommand(require(cmdPath));
					}
				`);
			} catch(err) {
				this.client.emit('warn', `Error when broadcasting command load to other shards`);
				this.client.emit('error', err);
				await msg.reply(oneLine`
					Команда \`${command.name}\` успешно загружена на текущем шарде,
					но её загрузка не удалась на других шардах.
				`);
				return null;
			}
		}

		await msg.reply(`Команда \`${command.name}\` успешно загружена${this.client.shard ? ' на всех шардах' : ''}.`);
		return null;
	}
};
