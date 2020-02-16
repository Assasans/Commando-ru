const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class UnloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unload',
			aliases: ['unload-command'],
			group: 'commands',
			memberName: 'unload',
			description: 'Выгружает команду.',
			details: oneLine`
				Аргументом должно быть название (частичное или полное) или ID команды.
				Только владельцы бота могу использовать эту команду.
			`,
			examples: ['unload some-command'],
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'command',
					prompt: 'Какую команду вы хотите выгрузить?',
					type: 'command'
				}
			]
		});
	}

	async run(msg, args) {
		args.command.unload();

		if(this.client.shard.length > 0) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) this.registry.commands.get('${args.command.name}').unload();
				`);
			} catch(err) {
				this.client.emit('warn', `Error when broadcasting command unload to other shards`);
				this.client.emit('error', err);
				return msg.reply(oneLine`
					Команда \`${args.command.name}\` успешно выгружена на текущем шарде,
					но её выгрузка не удалась на других шардах.
				`);
			}
		}

		return msg.reply(
			`Команда \`${args.command.name}\` успешно выгружена${this.client.shard.length > 0 ? ' на всех шардах' : ''}.`
		);
	}
};
