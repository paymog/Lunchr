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
                .success(function (data) {
                    authService.setUser(data);
                    $state.go('home');
                })
                .error(function (data) {
                    $scope.errorMessages = data;
                    $scope.password = "";
                });
        }
    }]);

lunchrControllers.controller('UserController', ['$scope', '$http', '$state', 'authService', 'socket',
    function ($scope, $http, $state, authService) {
        $scope.currentUser = authService.currentUser().firstname;
        
        $http.get('/api/users')
            .success(function (data) {
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
                .success(function (data) {
                    authService.setUser(data);
                    $state.go('home')
                }).
                error(function (data) {
                    $scope.errorMessages = data;
                })
        }
    }]);

lunchrControllers.controller( 'MapController', [ '$scope', '$http', '$state', 'ngGPlacesAPI',
    function ( $scope )
    {
        $scope.map = { center: { latitude: 49.8651559, longitude: -97.11077669999997 }, zoom: 14 };

        $scope.getUserLocation = function ( onSuccess, onError )
        {
            if ( navigator.geolocation )
            {
                navigator.geolocation.getCurrentPosition
                (
                    function ( position )
                    {
                        $scope.position = position;
                        onSuccess( position );
                    },
                    function ( error )
                    {
                        onError( error );
                    }
                );
            }
            else
            {
                alert( "Your browser does not support geolocation." );
            }
        };

        function onSuccess( position )
        {
            $scope.$apply( function( )
            {
                $scope.map = {
                    center: { latitude: position.coords.latitude, longitude: position.coords.longitude },
                    zoom: 14
                };
                $scope.marker = {
                    id: 0,
                    coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }
                };
            } );
        }

        function onError( error )
        {
            var errorMessage = "";

            switch ( error.code )
            {
                case error.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out.";
                    break;
                default:
                    errorMessage = "An unknown error occurred.";
                    break;
            }

            alert( errorMessage );
        }

        $scope.getUserLocation( onSuccess, onError );
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
        if(currentUser.matchedWith){
            $state.go('home.matched');
        }
        if(currentUser.wantsToBeMatched){
            $state.go('home.matching');
        }

        $scope.name = (currentUser.firstname + " " + currentUser.lastname);
        $scope.match = function () {
            $state.go('home.matching');
        };

        $scope.editInfo = function () {
        };
    }
]);
