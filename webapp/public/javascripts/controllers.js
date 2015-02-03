'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);

lunchrControllers.controller('MainPageController', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        $scope.createAccount = function () {
            $location.path('/register')
        }

        $scope.logIn = function () {
            $scope.errorsMessages = null;
            $http.post('/api/users/authenticate', {email: $scope.email, password: $scope.password}).
                success(function (data, status, headers, config) {
                    $location.path('/users');
                }).
                error(function (data, status, headers, config) {
                    $scope.errorsMessages = data;
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

lunchrControllers.controller('RegisterController', ['$scope', '$http', '$location',

    function ($scope, $http, $location) {

        $scope.register = function () {
            $http.post('/api/users/register', {
                email: $scope.email,
                password: $scope.password,
                firstname: $scope.firstname,
                lastname: $scope.lastname
            })
                .success(function (data, status, headers, config) {
                    $location.path('/users')
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
            })
        }
    }]);