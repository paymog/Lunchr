'use strict';

var lunchrApp = angular.module( 'lunchr', [ 'ui.router',
                                            'btford.socket-io',
                                            'lunchrControllers',
                                            'lunchrFactories', 
                                            'uiGmapgoogle-maps',
                                            'ngGPlaces',
                                            'lunchrServices' ] );

lunchrApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('mainPage', {
                url: '/',
                templateUrl: '/partials/main.jade',
                controller: 'MainPageController'
            })
            .state('home', {
                url: '/home',
                templateUrl: '/partials/home.jade',
                controller: 'HomePageController'
            })
            .state('users', {
                url: '/users',
                templateUrl: '/partials/users.jade',
                controller: 'UserController'
            })
            .state('home.matching', {
                url: '',
                templateUrl: '/partials/home.matching.jade',
                controller: 'HomeMatchingController'
            })
            .state('home.matched', {
                url: '',
                templateUrl: '/partials/home.matched.jade',
                params: {name: null},
                controller: 'HomeMatchedController'
            })
            .state('map', {
                url: '/map',
                templateUrl: '/partials/map.jade',
                controller: 'MapController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/register.jade',
                controller: 'RegisterController'
            });
        $locationProvider.html5Mode(true);
    }]);
