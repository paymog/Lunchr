'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);
var myApp = angular.module( 'myApp', [ 'ngMap' ] );

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
                lastname: $scope.lastname,
                age: $scope.age,
                radius: Number($scope.radius)
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

lunchrControllers.controller( 'MapController', [ '$scope', '$http', '$state', 'ngGPlacesAPI',
    function ( $scope, $http, $state, ngGPlacesAPI )
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
            //$scope.$apply( function( )
            //{
            $scope.map = {
                center: { latitude: position.coords.latitude, longitude: position.coords.longitude },
                zoom: 14
            };
            $scope.marker = {
                id: 0,
                coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }
            };
            //} );

            $scope.restaurantData = "Empty";
            $scope.data = "empty";

            //This is a patch for a known issue with the ngGPlacesAPI framework and angular 3.1
            var promise1 = ngGPlacesAPI.placeDetails( { reference: "CnRoAAAA_qz5XcCCCcEROmoujZ_HLtUd46slTejRW9pLTJ-izq-Y9vdCn-MgLDQk3rUqaPxfi3N0AeRVs3H7ZmAvItqyiVYoB-U8SW-g8lnQVUhgz7ldFh8VLFj0ZzzDbv6tVxfm5x8Tte3q2LRmuJe9OqNZoRIQIaRdxp2Kl4plsbonULFJrBoUeCyr2a4MRWyZfrtc6V1HikRH6s4" } );
            promise1.then( function ( data )
            {
                $scope.details = data;
            }, function ( reason )
            {
                alert( 'Failed: ' + reason );
            }, function ( update )
            {
                alert( 'Got notification: ' + update );
            } );

            var promise = ngGPlacesAPI.nearbySearch( {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            } );

            promise.then( function ( data )
            {
                $scope.data = data;
                //alert(data);
                //alert(data.length);
            }, function ( reason )
            {
                alert( 'Failed: ' + reason );
            }, function ( update )
            {
                alert( 'Got notification: ' + update );
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
