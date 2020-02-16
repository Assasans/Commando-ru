const ArgumentType = require('./base');

class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(val, msg, arg) {
		if(arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) {
			return `Пожалуйста, укажите однин из вариантов: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) {
			return `Длинна строки ${arg.label} должна быть больше или равнятся ${arg.min} символов.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) {
			return `Длинна строки ${arg.label} должна быть меньше или равнятс ${arg.max} символов.`;
		}
		return true;
	}

	parse(val) {
		return val;
	}
}

module.exports = StringArgumentType;
