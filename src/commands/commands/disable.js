const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off'],
			group: 'commands',
			memberName: 'disable',
			description: 'Отключает команду или группу команд.',
			details: oneLine`
				Аргументом должно быть название (частичное или полное) или ID команды или группы команд.
				Только владельцы бота могу использовать эту команду.
			`,
			examples: ['disable util', 'disable Utility', 'disable prefix'],
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Какую команду или группу команд вы хотите отключить?',
					type: 'group|command'
				}
			]
		});
	}

	run(msg, args) {
		if(!args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
			return msg.reply(
				`${args.cmdOrGrp.group ? 'Команда' : 'Группа'} \`${args.cmdOrGrp.name}\` уже отключена.`
			);
		}
		if(args.cmdOrGrp.guarded) {
			return msg.reply(
				`Вы не можете отключить ${args.cmdOrGrp.group ? 'команду' : 'группу'} \`${args.cmdOrGrp.name}\`.`
			);
		}
		args.cmdOrGrp.setEnabledIn(msg.guild, false);
		return msg.reply(`${args.cmdOrGrp.group ? 'Команда' : 'Группа'} \`${args.cmdOrGrp.name}\` успешно отключена.`);
	}
};
