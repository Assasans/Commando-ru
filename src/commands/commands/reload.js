const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class ReloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command'],
			group: 'commands',
			memberName: 'reload',
			description: 'Перезагужает команду или группу команд.',
			details: oneLine`
				Аргументом должно быть название (частичное или полное) или ID команды или группы команд.
				При вводе группы команд будут перезагружены все команды, находящиеся в ней.
				Только владельцы бота могу использовать эту команду.
			`,
			examples: ['reload some-command'],
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Какую команду или группу команд вы хотите перезагрузить?',
					type: 'group|command'
				}
			]
		});
	}

	async run(msg, args) {
		const { cmdOrGrp } = args;
		const isCmd = Boolean(cmdOrGrp.groupID);
		cmdOrGrp.reload();

		if(this.client.shard.length > 0) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						this.registry.${isCmd ? 'commands' : 'groups'}.get('${isCmd ? cmdOrGrp.name : cmdOrGrp.id}').reload();
					}
				`);
			} catch(err) {
				this.client.emit('warn', `Error when broadcasting command reload to other shards`);
				this.client.emit('error', err);
				if(isCmd) {
					return msg.reply(oneLine`
						Команда \`${cmdOrGrp.name}\` успешно перезагужена на текущем шарде,
						но её перезагрузка не удалась на других шардах.
					`);
				} else {
					return msg.reply(oneLine`
						Перезагружены все команды в группе \`${cmdOrGrp.name}\` на текущем шарде,
						но их перезагрузка не удалась на других шардах.
					`);
				}
			}
		}

		if(isCmd) {
			return msg.reply(oneLine`
				Команда \`${cmdOrGrp.name}\` успешно перезагружена${this.client.shard.length > 0 ? ' на всех шардах' : ''}.
			`);
		} else {
			return msg.reply(oneLine`
				Перезагружены все команды в группе
				\`${cmdOrGrp.name}\` ${this.client.shard.length > 0 ? ' на всех шардах' : ''}.
			`);
		}
	}
};
