'use strict';

var lunchrApp = angular.module('lunchr', ['ui.router', 'lunchrControllers']);

lunchrApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.
            state('mainPage', {
                url: '/',
                templateUrl: '/partials/main.jade',
                controller: 'MainPageController'
            })
            .state('users', {
                url: '/users',
                templateUrl: '/partials/users.jade',
                controller: 'UserController'
            })
            .state('users.matching', {
                url: '/matching',
                templateUrl: '/partials/users.matching.jade'
            })
            .state('users.matched', {
                url: '/matched',
                templateUrl: '/partials/users.matched.jade'
            })
            .state('register', {
                url:'/register',
                templateUrl: 'partials/register.jade',
                controller: 'RegisterController'
            });
        $locationProvider.html5Mode(true);
    }]);
