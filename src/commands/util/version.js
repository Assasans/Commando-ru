const { oneLine, stripIndents } = require('common-tags');
const Command = require('../base');

const fetch = require('node-fetch');

module.exports = class VersionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'version',
			group: 'util',
			memberName: 'version',
			description: oneLine`
				Показывает текущую версию и проверяет обновления для \`Commando\`.
				Только владельцы бота могу использовать эту команду.
			`,
			ownerOnly: true,
			aliases: [
				'updates'
			]
		});
	}

	run(message) {
		return new Promise(async(resolve, reject) => {
			const currentVersion = require('../../../package.json').version;
			const versionMessage = await message.say(stripIndents`
				${message.channel.type !== 'dm' ? `${message.author}, ` : ''}
				**Commando:**
				Текущая версия: \`${currentVersion}\`
				__Выполняется проверка обновлений...__
			`);

			fetch('https://registry.npmjs.org/@assasans/discord.js-commando')
				.then(response => response.json())
				.then(npmBody => {
					const npmVersion = npmBody ? npmBody['dist-tags'] ? npmBody['dist-tags'].latest : undefined : undefined;

					fetch('https://raw.githubusercontent.com/Assasans/Commando-ru/djs-v11/package.json')
						.then(response => response.json())
						.then(githubBody => {
							const githubVersion = githubBody ? githubBody.version : undefined;

							return resolve(versionMessage.edit(stripIndents`
								${message.channel.type !== 'dm' ? `${message.author}, ` : ''}
								**Commando:**
								Текущая версия: \`${currentVersion}\`
								${oneLine`
									Последняя версия (\`NPM\`): ${npmVersion ? `\`${npmVersion}\`
									${npmVersion > currentVersion ? ' (**доступно обновление**)' : ''}` : '[ неизвестно ]'}
								`}
								${oneLine`
									Последняя версия (\`GitHub\`, может быть нестабильной): ${githubVersion ? `\`${githubVersion}\`
									${githubVersion > npmVersion ? ' (доступно обновление)' : ''}` : '[ неизвестно ]'}
								`}
							`));
						})
						.catch(error => reject(error));
				})
				.catch(error => reject(error));
		});
	}
};
