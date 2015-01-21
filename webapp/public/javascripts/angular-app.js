'use strict';

// Declare app level module which depends on filters, and services
angular.module('lunchr', []).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider ) {
        $routeProvider.
            when('/', {
                templateUrl : 'partials/index',
                controller : MainPageController
            })
            .when('/users', {
                templateUrl : 'partials/users',
                controller : UserController
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);
