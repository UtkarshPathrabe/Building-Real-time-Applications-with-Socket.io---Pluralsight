const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8080;
const users = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
	console.log('new connection made');
	socket.on('get-users', function () {
		socket.emit('all-users', users);
	});
	// when new user joins
	socket.on('join', function (data) {
		// console.log(data); // nickname
		// console.log(users);
		socket.nickname = data.nickname;
		users[socket.nickname] = socket;
		const userObj = {
			nickname: data.nickname,
			socketid: socket.id,
		};
		users.push(userObj);
		io.emit('all-users', users);
	});
	// broadcast the message
	socket.on('send-message', function (data) {
		socket.broadcast.emit('message-received', data);
	});
	// send a 'like' to the user of my choice
	socket.on('send-like', function (data) {
		// console.log(data);
		socket.broadcast.to(data.like).emit('user-liked', data);
	});
	// disconnect from socket
	socket.on('disconnect', function () {
		users = users.filter(function (item) {
			return item.nickname !== socket.nickname;
		});
		io.emit('all-users', users);
	});
});

server.listen(port, function () {
	console.log('Listening on port ' + port);
});
