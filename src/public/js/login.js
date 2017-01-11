$(function() {
	var socket = io();

	$('#login').submit(function() {
		socket.emit('login', $('#username').val());
		return false;
	})

	socket.on('login', function(page) {
		console.log(page)
		socket.on('loggedin', function(usrs) {
			users = usrs
		})
		window.location = page
	})
});