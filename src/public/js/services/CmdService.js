app.service('cmds', function($http) {

	this.getCommands = function() {
		var cmds = {}
		$http.get('/cmds').success(function(data) {
			cmds = data;
		})
		return cmds
	}
})