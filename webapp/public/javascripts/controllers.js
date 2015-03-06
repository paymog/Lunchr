'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);

lunchrControllers.controller('MainPageController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {
        $scope.createAccount = function () {
            $state.go('register')
        };

        $scope.logIn = function () {
            $scope.errorMessages = null;

            if(!$scope.email || !$scope.password) {
                return;
            }

            $http.post('/api/users/authenticate', {email: $scope.email, password: $scope.password}).
                success(function (data, status, headers, config) {
                    $state.go('users');
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                })
        }
    }]);

lunchrControllers.controller('UserController', ['$scope', '$http',
    function ($scope, $http) {

        $http.get('/api/users')
            .success(function (data, status, headers, config) {
                $scope.users = data;
            })

    }]);

lunchrControllers.controller('RegisterController', ['$scope', '$http', '$state',

    function ($scope, $http, $state) {

        $scope.register = function () {
            $scope.errorMessages = null;

            if(!$scope.email || !$scope.password || !$scope.firstname || !$scope.lastname) {
                return;
            }

            $http.post('/api/users/register', {
                email: $scope.email,
                password: $scope.password,
                firstname: $scope.firstname,
                lastname: $scope.lastname
            })
                .success(function (data, status, headers, config) {
                    $state.go('users')
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                })
        }
    }]);

lunchrControllers.controller('MapController', ['$scope', '$http', '$state', 'ngGPlacesAPI',
    function ($scope, $http, $state, ngGPlacesAPI) {
        $scope.map = { center: { latitude: 49.8651559, longitude: -97.11077669999997 }, zoom: 14 };
        if ( navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    $scope.position = position;
                    $scope.map = {
                        center: {latitude: position.coords.latitude, longitude: position.coords.longitude},
                        zoom: 14
                    };
                    $scope.marker = {
                        id: 0,
                        coords: {latitude: position.coords.latitude, longitude: position.coords.longitude}
                    };
                    $scope.restaurantData = ngGPlacesAPI.nearbySearch({latitude:position.latitude, longitude:position.longitude}).then(
                        function(data){
                            return data;
                        });
                    alert($scope.restaurantData);
                });
            });
        }
    }]);