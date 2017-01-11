app.directive('mycard', function() {
	return {
		scope: true,
		restrict: 'E',
		templateUrl: function(element, attribute) {
			return "templates/card.template.html"
		}
	}
});

app.directive('msgcard', function() {
	return {
		scope: true,
		restrict: 'E',
		templateUrl: function(element, attribute) {
			return "templates/msgcard.template.html"
		}
	}
});

app.directive('navmenu', function() {
	return {
		scope: true,
		restrict: 'E',
		templateUrl: function(element, attribute) {
			return "templates/navmenu.template.html"
		}
	}
});