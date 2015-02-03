'use strict';

var lunchrApp = angular.module('lunchr', ['ngRoute', 'lunchrControllers']);

lunchrApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/partials/main.jade',
                controller: 'MainPageController'
            })
            .when('/users', {
                templateUrl: '/partials/users.jade',
                controller: 'UserController'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);
