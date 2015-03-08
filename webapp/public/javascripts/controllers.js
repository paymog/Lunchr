'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);

lunchrControllers.controller('MainPageController', ['$scope', '$http', '$state', 'authService',
    function ($scope, $http, $state, authService) {
        $scope.createAccount = function () {
            $state.go('register');
        };

        $scope.logIn = function () {
            $scope.errorMessages = null;

            if (!$scope.email || !$scope.password) {
                return;
            }

            $http.post('/api/users/authenticate', {email: $scope.email, password: $scope.password})
                .success(function (data, status, headers, config) {
                    authService.login($scope.email);
                    $state.go('home', data[0].firstname + " " + data[0].lastname);
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                })
        }
    }]);

lunchrControllers.controller('UserController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {

        $http.get('/api/users')
            .success(function (data, status, headers, config) {
                $scope.users = data;
            });

        $scope.match = function () {
            $state.go('users.matching');
        };
    }]);

lunchrControllers.controller('RegisterController', ['$scope', '$http', '$state', 'authService',

    function ($scope, $http, $state, authService) {

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
                    authService.login($scope.email);
                    $state.go('users')
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                })
        }
    }]);

lunchrControllers.controller('UserMatchingController', ['$state', 'socket', 'authService',
    function ($state, socket, authService) {
        socket.emit('match', {user: authService.currentUser()});

        socket.on('matched' + authService.currentUser(), function (data) {
            $state.go('users.matched', {name: data.name})
        });
    }]);

lunchrControllers.controller('UserMatchedController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
        $scope.name = $stateParams.name;
    }]);

lunchrControllers.controller('HomePageController', ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {
        $scope.userName = $stateParams.name;
        $scope.match = function () {
            ;
        };

        $scope.editInfo = function () {
            ;
        };
    }
]);
