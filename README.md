# Json-server-chat

## Начальный этап

Скопируй репозиторий

```bash
git clone https://github.com/simba-junior/json-server-chat.git
```

После комирования запусти скрипт по установке зависимостей

```bash
npm install 
```

Далее запусти сервер

```bash
npm run start
```

Сервер запустится по адресу [http://localhost:3000](http://localhost:3000).
Swagger запустится по адресу [http://localhost:3000/api-doc](http://localhost:3000/api-doc).

## Советы

На сервере насторен socket.io, который поддерживает ряд событий

`join_channel` - вызывая это событие пользователь подключается к каналу. Пример использования
```js
socket.emit('join_channel', {
  userId: 'feb042250f75284d5c91f42190afc289',
  channelName: "Test channel"
})
```

`send_message` - вызывая это событие пользователь отправляет сообщение всем пользователям в текущем канале. Пример использования
```js
socket.emit('send_message', {
  userId: 'feb042250f75284d5c91f42190afc289',
  channelId: '5dbb3ca088c9823994e1b078ba4f5ac2',
  message: 'hello world'
})
```

`leave_channel` - вызывая это событие пользователя удаляют из текущего канала. Пример использования
```js
socket.emit('leave_channel', {
  channelId: '5dbb3ca088c9823994e1b078ba4f5ac2'
})
```

`receive_message` - прослушивая это событие, можно получить сообщение, которое было отправлено пользователями текущего канала. Пример использования
```js
socket.on('receive_message', (msg) => {
  console.log(msg)
})
```
