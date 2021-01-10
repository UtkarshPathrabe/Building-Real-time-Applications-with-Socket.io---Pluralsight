(function () {
	'use strict';

	angular.module('app').controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

	function MainCtrl($scope, $localStorage, socket, lodash) {
		$scope.message = '';
		$scope.messages = [];
		$scope.users = [];
		$scope.likes = [];
		$scope.mynickname = $localStorage.nickname;
		const nickname = $scope.mynickname;

		socket.emit('get-users');

		socket.on('all-users', function (data) {
			// console.log(data);
			$scope.users = data.filter(function (item) {
				return item.nickname !== nickname;
			});
		});

		socket.on('message-received', function (data) {
			$scope.messages.push(data);
		});

		socket.on('user-liked', function (data) {
			// console.log(data);
			$scope.likes.push(data.from);
		});

		$scope.sendMessage = function (data) {
			const newMessage = {
				message: $scope.message,
				from: $scope.mynickname,
			};
			socket.emit('send-message', newMessage);
			$scope.message = '';
			$scope.messages.push(newMessage);
		};

		$scope.sendLike = function (user) {
			// console.log(user);
			const id = lodash.get(user, 'socketid');
			const likeObj = {
				from: nickname,
				like: id,
			};
			socket.emit('send-like', likeObj);
		};
	}
})();
