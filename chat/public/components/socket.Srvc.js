(function () {
	'use strict';

	angular.module('app').factory('socket', socket);

	socket.$inject = ['$rootScope'];

	function socket($rootScope) {
		const socket = io.connect();
		return {
			on: on,
			emit: emit,
		};
		// Socket 'on' and 'emit' methods here
		function on(eventName, callback) {
			socket.on(eventName, function () {
				const args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		}
		function emit(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				const args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
})();
