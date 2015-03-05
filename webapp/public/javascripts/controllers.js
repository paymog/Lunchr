'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);

lunchrControllers.controller('MainPageController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {
        $scope.createAccount = function () {
            $state.go('register')
        };

        $scope.logIn = function () {
            $scope.errorMessages = null;

            if (!$scope.email || !$scope.password) {
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

lunchrControllers.controller('UserController', ['$scope', '$http', '$state', 'socket',
    function ($scope, $http, $state, socket) {

        $http.get('/api/users')
            .success(function (data, status, headers, config) {
                $scope.users = data;
            });

        $scope.match = function () {
            $state.go('users.matching');
        };
    }]);

lunchrControllers.controller('RegisterController', ['$scope', '$http', '$state',

    function ($scope, $http, $state) {

        $scope.register = function () {
            $scope.errorMessages = null;

            if (!$scope.email || !$scope.password || !$scope.firstname || !$scope.lastname) {
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

lunchrControllers.controller('UserMatchingController', ['$state', 'socket',
    function ($state, socket) {
        socket.emit('match');

        socket.on('matched', function (data) {
            $state.go('users.matched', {name: data.name})
        });
    }]);

lunchrControllers.controller('UserMatchedController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
        $scope.name = $stateParams.name;
    }]);