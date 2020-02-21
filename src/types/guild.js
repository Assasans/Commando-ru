const ArgumentType = require('./base');
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('discord.js');

class guildArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'guild');
	}

	validate(value, msg, arg) {
		const matches = value.match(/^(?:<#)?([0-9]+)>?$/);
		if(matches) return msg.client.guilds.has(matches[1]);
		const search = value.toLowerCase();
		let guilds = msg.client.guilds.filterArray(nameFilterInexact(search));
		if(guilds.length === 0) return false;
		if(guilds.length === 1) {
			if(arg.oneOf && !arg.oneOf.includes(guilds[0].id)) return false;
			return true;
		}
		const exactguilds = guilds.filter(nameFilterExact(search));
		if(exactguilds.length === 1) {
			if(arg.oneOf && !arg.oneOf.includes(exactguilds[0].id)) return false;
			return true;
		}
		if(exactguilds.length > 0) guilds = exactguilds;
		return guilds.length <= 15 ?
			`${disambiguation(guilds.map(chan => escapeMarkdown(chan.name)), 'серверов', null)}\n` :
			'Найдено несколько серверов. Пожалуйста, укажите более точное название.';
	}

	parse(value, msg) {
		const matches = value.match(/^(?:<#)?([0-9]+)>?$/);
		if(matches) return msg.client.guilds.get(matches[1]) || null;
		const search = value.toLowerCase();
		const guilds = msg.client.guilds.filterArray(nameFilterInexact(search));
		if(guilds.length === 0) return null;
		if(guilds.length === 1) return guilds[0];
		const exactguilds = guilds.filter(nameFilterExact(search));
		if(exactguilds.length === 1) return exactguilds[0];
		return null;
	}
}

function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}

module.exports = guildArgumentType;
