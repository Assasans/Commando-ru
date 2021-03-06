# Commando RU
[![Dependency status](https://img.shields.io/github/languages/code-size/Assasans/Commando-ru)](https://david-dm.org/discordjs/Commando)

## Описание

Русская локализация командного фреймворка [Commando](https://github.com/discordjs/Commando), работающего поверх [discord.js](https://github.com/discordjs/discord.js).

Полностью объектно-ориентированный, лёгкий в использовании.
Использует функционал ES2017 (`async`/`await`).

## Функционал

* Названия команд
	* Альтернативные названия команд
	* Триггеры на основе регулярных выражений
* Сложная система аргументов
	* Система типов аргументов с правилами, проверкой и парсингом значений
		* Простые типы (`string`, `integer`, `float`, `boolean`)
		* Объекты Дискорда (`user`, `member`, `role`, `channel`, `message`)
		* Пользовательские типы
		* Объединенные типы
	* Необязательные аргументы
	* Стандартные значения аргументов
	* Поддержка бесконечных аргументов
	* Поддержка аргументов с кавычками
	* Повторный запрос неверных аргументов
	* Автоматический запрос аргументов, которые не были указаны
* Повторная обработка сообщений при редактировании
* Задержка на повторное использование команд
* Загрузка / выгрузка команд на лету

## Установка

**Необходима версия Node 12.7.3 или выше.**

NPM: `npm install @assasans/discord.js-commando`

Github: `npm install Assasans/Commando-ru#master`

## Документация

[Официальная документация Commando (англ.)](https://discord.js.org/#/docs/commando)

[Официальная документация DiscordJS (англ.)](https://discord.js.org/#/docs)
