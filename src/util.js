function escapeRegex(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Найдено несколько ${label}, пожалуйста, укажите более точное значение: ${itemList}`;
}

function paginate(items, page = 1, pageLength = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if(page < 1) page = 1;
	if(page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}

const permissions = {
	ADMINISTRATOR: 'Администратор',
	VIEW_AUDIT_LOG: 'Просмотр журнала аудита',
	MANAGE_GUILD: 'Управление сервером',
	MANAGE_ROLES: 'Управление ролями',
	MANAGE_CHANNELS: 'Управление каналами',
	KICK_MEMBERS: 'Выгонять участников',
	BAN_MEMBERS: 'Банить участников',
	CREATE_INSTANT_INVITE: 'Создание приглашения',
	CHANGE_NICKNAME: 'Изменить никнейм',
	MANAGE_NICKNAMES: 'Управление никнеймами',
	MANAGE_EMOJIS: 'Управление эмодзи',
	MANAGE_WEBHOOKS: 'Управление вебхуками',
	VIEW_CHANNEL: 'Читать текстовые каналы и видеть голосовые каналы',
	SEND_MESSAGES: 'Отправлять сообщения',
	SEND_TTS_MESSAGES: 'Отправлять TTS сообщения',
	MANAGE_MESSAGES: 'Управление сообщениями',
	EMBED_LINKS: 'Встраивать ссылки',
	ATTACH_FILES: 'Прикреплять файлы',
	READ_MESSAGE_HISTORY: 'Читать историю сообщений',
	MENTION_EVERYONE: 'Упоминать всех',
	USE_EXTERNAL_EMOJIS: 'Использовать внешние эмодзи',
	ADD_REACTIONS: 'Добавлять реакции',
	CONNECT: 'Подключатся к голосовый каналам',
	SPEAK: 'Говорить в голосовых каналах',
	MUTE_MEMBERS: 'Отключать участникам микрофон',
	DEAFEN_MEMBERS: 'Отключать участникам звук',
	MOVE_MEMBERS: 'Перемещать участников в голосовых каналах',
	USE_VAD: 'Использовать режим активации по голосу'
};

module.exports = {
	escapeRegex,
	disambiguation,
	paginate,
	permissions
};
