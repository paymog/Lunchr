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

lunchrControllers.controller('UserController', ['$scope', '$http', 'authService',
    function ($scope, $http, authService) {
        $scope.currentUser = authService.currentUser().firstname;

        $http.get('/api/users')
            .success(function (data) {
                $scope.users = data;
            });
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

lunchrControllers.controller( 'MapController', [ '$scope', '$http', '$state', 'ngGPlacesAPI', 'ngProgress',
    function ( $scope, $http, $state, ngGPlacesAPI, ngProgress )
    {
        var defaultVals = {latitude: 49.8651559, longitude: -97.11077669999997, zoom: 14};
        $scope.map = { center: { latitude: defaultVals.latitude, longitude: defaultVals.longitude }, zoom: defaultVals.zoom };
        $scope.marker = [ ];
        $scope.selectedPlaces = [ ];

        $scope.getUserLocation = function ( onSuccess, onError )
        {
            if ( navigator.geolocation )
            {
                navigator.geolocation.getCurrentPosition
                (
                    function( position )
                    {
                        $scope.position = position;
                        onSuccess( position );
                    },
                    function( error )
                    {
                        onError( error );
                    }
                );
            }
            else
            {
                $scope.warningMessages = "Your browser does not support geolocation. Using default values.";
                $scope.postition = { coords: { latitude: defaultVals.latitude, longitude: defaultVals.longitude } };
                onSuccess( $scope.position);
            }
        };
        
        function onSuccess( position )
        {
            ngProgress.start( );
            $scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 14 };
            $scope.marker.push( {
                id: 0,
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }, 
                icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                options: { 
                    labelContent: "You Are Here",
                    labelClass: "labels label-user-pos",
                    animation: google.maps.Animation.DROP,
                    clickable: false
                }
            } );

            $scope.data = "empty";
            var key = -1;

            var promise = ngGPlacesAPI.nearbySearch( {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            } );

            promise.then( function( data )
            {
                $scope.data = data;
                for ( key in data )
                {
                    $scope.locationDetails = ngGPlacesAPI.placeDetails( {
                        reference: ( $scope.data )[ key ].reference
                    } ).then(
                        function( data )
                        {
                            $scope.marker.push( {
                                id: key + 1,
                                coords: {
                                    latitude: data.geometry.location.k,
                                    longitude: data.geometry.location.D
                                },
                                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                options: {
                                    labelContent: data.name,
                                    labelClass: "labels",
                                    animation: google.maps.Animation.DROP
                                },
                                click: function( )
                                {
                                    var index = $scope.selectedPlaces.indexOf( data.name );

                                    if ( index > -1 )
                                    {
                                        removeSelectedPlaceFromList( $scope.selectedPlaces[ index ] );
                                        $scope.selectedPlaces.splice( index, 1 );
                                    }
                                    else
                                    {
                                        addSelectedPlaceToList( data.name );
                                        $scope.selectedPlaces.push( data.name );
                                    }

                                    console.log( $scope.selectedPlaces );
                                }
                            } );
                        }
                    );
                }
                ngProgress.complete( );
            }, 
            function( reason )
            {
                alert( 'Failed: ' + reason );
                ngProgress.reset( );
            },
            function( update )
            {
                alert( 'Got notification: ' + update );
            } );
        }

        function onError( error )
        {
            switch( error.code )
            {
                case error.PERMISSION_DENIED:
                    $scope.errorMessages = "Geolocation is disabled for this site. This site requires Geolocation to work properly.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.errorMessages = "Your location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    $scope.errorMessages = "The request to get user location timed out.";
                    break;
                default:
                    $scope.errorMessages = "An unknown error has occurred.";
                    break;
            }
        }
        $scope.getUserLocation( onSuccess, onError );
        
        function addSelectedPlaceToList( place )
        {
            //var placesList = document.getElementById( "selectedPlaces" );
            //var placesListItem = document.createElement( "li" );
            //
            //placesListItem.appendChild( document.createTextNode( place ) );
            //placesListItem.setAttribute( "class", "list-group-item" );
            //placesList.appendChild( placesListItem );

            var placesList = document.getElementById( "selectedPlaces" );
            
            var placesItemDiv = document.createElement( "div" );
            placesItemDiv.setAttribute( "class", "alert alert-warning alert-dismissible placesItem" );
            placesItemDiv.setAttribute( "role", "alert" );
            
            var placesItemButton = document.createElement( "button" );
            placesItemButton.setAttribute( "type", "button" );
            placesItemButton.setAttribute( "class", "close" );
            placesItemButton.setAttribute( "data-dismiss", "alert" );
            placesItemButton.setAttribute( "aria-label", "Close" );
            
            var placesItemSpan = document.createElement( "span" );
            placesItemSpan.setAttribute( "aria-hidden", "true" );
            
            placesItemSpan.appendChild( document.createTextNode( "×" ) );
            placesItemButton.appendChild( placesItemSpan );
            placesItemDiv.appendChild( placesItemButton );
            placesItemDiv.appendChild( document.createTextNode( place ) );
            placesList.appendChild( placesItemDiv );

            placesItemButton.addEventListener( "click", function( )
            {
                // Note: This does NOT remove the item from $scope.selectedPlaces
                this.parentNode.remove( );
            } );
        }
        
        function removeSelectedPlaceFromList( place )
        {
            //$( "li" ).filter
            //(
            //    function( )
            //    { 
            //        return $.text( [this] ) === place;
            //    }
            //).remove( );

            $( '.placesItem' ).filter
            (
                function( )
                {
                    // filter function combines all child text nodes
                    // this removes the × from the close button
                    return $( this ).text( ).substr( 1 ) ==  place;
                } 
            ).remove( );
        }
    }]);
