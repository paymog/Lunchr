'use strict';

var lunchrApp = angular.module('lunchr', ['ui.router', 'btford.socket-io', 'lunchrControllers', 'lunchrFactories', 'uiGmapgoogle-maps', 'ngGPlaces']);

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
                templateUrl: '/partials/users.matching.jade',
                controller: 'UserMatchingController'
            })
            .state('users.matched', {
                url: '/matched',
                templateUrl: '/partials/users.matched.jade',
                params:{name:null},
                controller: 'UserMatchedController'
            })
            .state('map', {
                url: '/map',
                templateUrl: '/partials/map.jade',
                controller: 'MapController'
            })
            .state('register', {
                url:'/register',
                templateUrl: 'partials/register.jade',
                controller: 'RegisterController'
            });
        $locationProvider.html5Mode(true);
    }]);
