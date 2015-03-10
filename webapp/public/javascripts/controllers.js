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
                    $state.go('home');
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                });
        }
    }]);

lunchrControllers.controller('UserController', ['$scope', '$http', '$state', 'authService', 'socket',
    function ($scope, $http, $state, authService, socket) {
        $scope.currentUser = authService.currentUser().firstname;

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

            if (!$scope.email || !$scope.password || !$scope.firstname ||
                !$scope.lastname || !$scope.age || !$scope.radius) {
                return;
            }

            $http.post('/api/users/register', {
                email: $scope.email,
                password: $scope.password,
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                age: Number($scope.age),
                radius: Number($scope.radius)
            })
                .success(function (data, status, headers, config) {
                    authService.setUser(data);
                    $state.go('users')
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                })
        }
    }]);

lunchrControllers.controller('UserMatchingController', ['$state', 'socket', 'authService',
    function ($state, socket, authService) {
        socket.emit('match', {userEmail: authService.currentUser().email});

        socket.on('matched' + authService.currentUser().email, function (data) {
            $state.go('users.matched', {name: data.name})
        });
    }]);

lunchrControllers.controller('UserMatchedController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
        $scope.name = $stateParams.name;
    }]);

lunchrControllers.controller('HomePageController', ['$scope', '$http', '$state', 'authService',
    function ($scope, $http, $state, authService) {
        $http.get('api/users', {params: {email: authService.currentUser()}})
            .success(function (data, status, headers, config) {
                $scope.name = (data[0].firstname + " " + data[0].lastname);
            })
            .error(function (data, status, headers, config) {
                ;//couldnt find user in db
            });
        $scope.match = function () {
            ;
        };

        $scope.editInfo = function () {
            ;
        };
    }
]);
