const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class EnableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'cmd-on', 'command-on'],
			group: 'commands',
			memberName: 'enable',
			description: 'Включает команду или группу команд.',
			details: oneLine`
				Аргументом должно быть название (частичное или полное) или ID команды или группы команд.
				Только владельцы бота могу использовать эту команду.
			`,
			examples: ['enable util', 'enable Utility', 'enable prefix'],
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Какую команду или группу команд вы хотите включить?',
					type: 'group|command'
				}
			]
		});
	}

	run(msg, args) {
		const group = args.cmdOrGrp.group;
		if(args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
			return msg.reply(
				`${args.cmdOrGrp.group ? 'Команда' : 'Группа'} \`${args.cmdOrGrp.name}\` уже включена${
					group && !group.isEnabledIn(msg.guild) ?
					`, но группа \`${group.name}\` отключена, поэтому команда не может быть использована` :
					''
				}.`
			);
		}
		args.cmdOrGrp.setEnabledIn(msg.guild, true);
		return msg.reply(
			`${group ? 'Команда' : 'Группа'}\`${args.cmdOrGrp.name}\` успешно включена${
				group && !group.isEnabledIn(msg.guild) ?
				`, но группа \`${group.name}\` отключена, поэтому команда не может быть использована` :
				''
			}.`
		);
	}
};
