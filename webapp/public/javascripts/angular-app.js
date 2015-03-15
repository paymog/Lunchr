'use strict';

var lunchrApp = angular.module('lunchr', ['ui.router', 'lunchrControllers', 'uiGmapgoogle-maps', 'ngGPlaces']);

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
