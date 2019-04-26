var app = angular.module('blogApp');

//*** Directives ***
app.directive('navigation', function() {
    return {
	restrict: 'EA',
	templateUrl: '/nav/navigation.html',
	controller: 'NavigationController',
	controllerAs: 'vm'
    };
});

//*** Controller ***
app.controller('NavigationController', ['$http', '$location', 'authentication', function NavigationController($http, $location, authentication) {
    var vm = this;
    vm.currentPath = $location.path();
    vm.currentUser = function()  {
        return authentication.currentUser();
    }
    vm.loggedIn = function() {
        return authentication.isLoggedIn();
    }
    vm.logout = function() {
	authentication.logout();
	$location.path('/').replace();
    };
}]);
