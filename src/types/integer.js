const ArgumentType = require('./base');

class IntegerArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'integer');
	}

	validate(value, msg, arg) {
		const int = Number.parseInt(value);
		if(Number.isNaN(int)) return false;
		if(arg.oneOf && !arg.oneOf.includes(int)) {
			return `Пожалуйста, укажите однин из вариантов: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && int < arg.min) {
			return `Пожалуйста, укажите число, которое больше или равно ${arg.min}.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && int > arg.max) {
			return `Пожалуйста, укажите число, которое меньше или равно ${arg.max}.`;
		}
		return true;
	}

	parse(value) {
		return Number.parseInt(value);
	}
}

module.exports = IntegerArgumentType;
