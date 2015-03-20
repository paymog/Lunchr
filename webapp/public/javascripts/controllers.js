'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);
var userLogout = function (authService, $state) {
    authService.removeUser();
    $state.go('mainPage');
};
var checkUser = function (user) {
    if(user)
        return true;
    return false;
};

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
                    authService.setUser(data);
                    $state.go('home');
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                });
        }
    }]);

lunchrControllers.controller('UserController', ['$scope', '$http', '$state', 'authService',
    function ($scope, $http, $state, authService) {
        $scope.currentUser = authService.currentUser();
        $scope.init = function () {
            return checkUser($scope.currentUser);
        };

        if($scope.currentUser) {
            $scope.logout = function () {
                userLogout(authService, $state);
            };

            $http.get('/api/users')
                .success(function (data) {
                    $scope.users = data;
                });
        }
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
                    $state.go('home')
                }).
                error(function (data, status, headers, config) {
                    $scope.errorMessages = data;
                })
        }
    }]);

lunchrControllers.controller('HomeMatchingController', ['$state', 'socket', 'authService',
    function ($state, socket, authService) {
        var currentUser = authService.currentUser();
        socket.emit('match', {userEmail: currentUser.email});

        socket.on('hasBeenMatched', function(data){
            var userObject = angular.fromJson(data.user);
            authService.setUser(userObject);
        });


        socket.on('matched' + currentUser.email, function (data) {
            var userObject = angular.fromJson(data.user);
            authService.setUser(userObject);
            $state.go('home.matched');
        });
    }]);

lunchrControllers.controller('HomeMatchedController', ['$scope', 'authService',
    function ($scope, authService) {
        var user = authService.currentUser();
        $scope.name = user.matchedWith;
    }]);

lunchrControllers.controller('HomePageController', ['$scope', '$http', '$state', 'authService',
    function ($scope, $http, $state, authService) {
        var currentUser = authService.currentUser();
        $scope.init = function () {
            return checkUser(currentUser);
        };

        if(currentUser) {
            $scope.logout = function () {
                userLogout(authService, $state);
            };

            if (currentUser.matchedWith) {
                $state.go('home.matched');
            }
            if (currentUser.wantsToBeMatched) {
                $state.go('home.matching');
            }

            $scope.name = (currentUser.firstname + " " + currentUser.lastname);
            $scope.match = function () {
                $state.go('home.matching');
            };

            $scope.editInfo = function () {
            };
        }
    }
]);
