const ArgumentType = require('./base');
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('discord.js');

class GroupArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'group');
	}

	validate(value) {
		const groups = this.client.registry.findGroups(value);
		if(groups.length === 1) return true;
		if(groups.length === 0) return false;
		return groups.length <= 15 ?
			`${disambiguation(groups.map(grp => escapeMarkdown(grp.name)), 'groups', null)}\n` :
			'Найдено несколько групп. Пожалуйста, укажите более точное название.';
	}

	parse(value) {
		return this.client.registry.findGroups(value)[0];
	}
}

module.exports = GroupArgumentType;
