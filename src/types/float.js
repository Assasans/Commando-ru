const ArgumentType = require('./base');

class FloatArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'float');
	}

	validate(value, msg, arg) {
		const float = Number.parseFloat(value);
		if(Number.isNaN(float)) return false;
		if(arg.oneOf && !arg.oneOf.includes(float)) {
			return `Пожалуйста, укажите однин из вариантов: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && float < arg.min) {
			return `Пожалуйста, укажите число, которое больше или равно ${arg.min}.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && float > arg.max) {
			return `Пожалуйста, укажите число, которое меньше или равно ${arg.max}.`;
		}
		return true;
	}

	parse(value) {
		return Number.parseFloat(value);
	}
}

module.exports = FloatArgumentType;
