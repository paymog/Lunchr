'use strict';

var lunchrApp = angular.module('lunchr', ['ui.router',
                                          'btford.socket-io',
                                          'lunchrControllers',
                                          'lunchrFactories',
                                          'lunchrServices',
                                          'uiGmapgoogle-maps',
                                          'ngGPlaces',
                                          'ngProgress']);

lunchrApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'ngGPlacesAPIProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, ngGPlacesAPIProvider) {
        $urlRouterProvider.otherwise('/');

        var defaults = {
            radius: 2000,
            sensor: false,
            latitude: null,
            longitude: null,
            types: ['restaurant'],
            map: null,
            elem: null,
            nearbySearchKeys: ['name', 'reference', 'vicinity'],
            placeDetailsKeys: ['formatted_address', 'formatted_phone_number',
                'reference', 'website', 'name', 'geometry'
            ],
            nearbySearchErr: 'Unable to find nearby places',
            placeDetailsErr: 'Unable to find place details'
        };
        ngGPlacesAPIProvider.setDefaults(defaults);

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
            .state('info', {
                url: '/info',
                templateUrl: '/partials/info.jade',
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
