'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);

lunchrControllers.controller('MainPageController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {
        $scope.createAccount = function () {
            $state.go('register');
        };

        $scope.logIn = function () {
            $scope.errorMessages = null;

            if(!$scope.email || !$scope.password) {
                return;
            }

            $http.post('/api/users/authenticate', {email: $scope.email, password: $scope.password})
                .success(function (data, status, headers, config) {
                    var name = data[0].firstname + " " + data[0].lastname;
                    $state.go('home', {name: name});
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                })
        }
    }]);

lunchrControllers.controller('HomePageController', ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {
        $scope.userName = $stateParams.name;
        $scope.match = function () {
            //$state.go('match');
        };

        $scope.editInfo = function () {
            //$state.go('editInformation');
            //also needs to go to new page
        };
    }
]);

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