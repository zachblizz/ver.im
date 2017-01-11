app.controller('NavCtrl', function($scope, $mdSidenav) {
	$scope.openMenu = function() {
		$mdSidenav('menu').toggle();
	}
});