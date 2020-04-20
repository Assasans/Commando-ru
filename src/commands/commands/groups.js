const { stripIndents } = require('common-tags');
const Command = require('../base');

module.exports = class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups'],
			group: 'commands',
			memberName: 'groups',
			description: 'Выводит список всех групп команд.',
			details: 'Только владельцы бота могу использовать эту команду.',
			guarded: true,
			ownerOnly: true
		});
	}

	run(msg) {
		return msg.reply(stripIndents`
			**Группы:**
			${this.client.registry.groups.map(grp =>
				`${grp.name}: ${grp.isEnabledIn(msg.guild) ? 'Включена' : 'Отключена'}`
			).join('\n')}
		`);
	}
};
