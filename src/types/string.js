const ArgumentType = require('./base');

class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(value, msg, arg) {
		if(arg.oneOf && !arg.oneOf.includes(value.toLowerCase())) {
			return `Пожалуйста, укажите однин из вариантов: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && value.length < arg.min) {
			return `Длинна строки ${arg.label} должна быть больше или равнятся ${arg.min} символов.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && value.length > arg.max) {
			return `Длинна строки ${arg.label} должна быть меньше или равнятся ${arg.max} символов.`;
		}
		return true;
	}

	parse(value) {
		return value;
	}
}

module.exports = StringArgumentType;
