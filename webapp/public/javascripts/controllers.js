'use strict';

var lunchrControllers = angular.module('lunchrControllers', []);
var checkUser = function (user) {
    if(user)
        return true;
    return false;
};
var DefineNavigation = function ($scope, $state, authService) {
    $scope.logout = function () {
        authService.removeUser();
        $state.go('mainPage');
    };
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

lunchrControllers.controller('UserController', ['$scope', '$http', '$state', 'authService',
    function ($scope, $http, $state, authService) {
        $scope.currentUser = authService.currentUser();
        $scope.init = function () {
            return checkUser($scope.currentUser);
        };

        if($scope.currentUser) {
            DefineNavigation($scope, $state, authService);

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
        socket.emit('match', {userEmail: currentUser.email, restaurants: currentUser.restaurants});

        socket.on('hasBeenMatched', function(data){
            authService.setUser(data.user);
        });


        socket.on('matched' + currentUser.email, function (data) {
            authService.setUser(data.user);
            $state.go('home.matched');
        });
    }]);

lunchrControllers.controller('HomeMatchedController', ['$scope', 'authService',
    function ($scope, authService) {
        var user = authService.currentUser();
        $scope.name = user.matchedWith;
    }]);

lunchrControllers.controller('HomePageController', ['$scope', '$http', '$state', 'authService', 'socket',
    function ($scope, $http, $state, authService, socket) {
        var currentUser = authService.currentUser();
        $scope.init = function () {
            return checkUser(currentUser);
        };

        if(currentUser) {
            DefineNavigation($scope, $state, authService);

            if (currentUser.matchedWith) {
                $state.go('home.matched');
            }
            if (currentUser.wantsToBeMatched) {
                $state.go('home.matching');
            }

            $scope.name = (currentUser.firstname + " " + currentUser.lastname);
            $scope.startMatch = function () {
                $state.go('map');
            };
            $scope.finishEating = function () {
                currentUser.matchedWith = "";
                currentUser.wantsToBeMatched = false;
                currentUser.restaurants = [];
                authService.setUser(currentUser);
                socket.emit('finished', {userEmail: currentUser.email});
                $state.go('home');
            };
        }
    }
]);

lunchrControllers.controller(
    'MapController', [ '$scope', '$http', '$state', 'ngGPlacesAPI', 'ngProgress', 'authService',
    function ( $scope, $http, $state, ngGPlacesAPI, ngProgress, authService )
    {
        $scope.currentUser = authService.currentUser();
        $scope.init = function () {
            return checkUser($scope.currentUser);
        };

        if($scope.currentUser)
        {
            ngProgress.color('royalblue');
            ngProgress.start();

            DefineNavigation($scope, $state, authService);
            $scope.match = function () {
                if($scope.selectedPlaces.length !=0) {
                    $scope.currentUser.restaurants = $scope.selectedPlaces;
                    authService.setUser($scope.currentUser);
                    $state.go('home.matching');
                }
                else {
                    var errorAlert = $("#error");
                    errorAlert.html("<strong>Error</strong> - You must pick at least 1 restuarant to proceed.");
                    errorAlert.toggleClass("alertMsg");
                }
            };
            var defaultVals = {latitude: 49.8651559, longitude: -97.11077669999997, zoom: 14};
            $scope.map = {
                center: {latitude: defaultVals.latitude, longitude: defaultVals.longitude},
                zoom: defaultVals.zoom
            };
            $scope.markers = [];
            $scope.selectedPlaces = [];

            $scope.getUserLocation = function (onSuccess, onError) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition
                    (
                        function (position) {
                            $scope.position = position;
                            onSuccess(position);
                        },
                        function (error) {
                            onError(error);
                        }
                    );
                }
                else {
                    var warningAlert = $("#warning");

                    $scope.warningMessages = "<strong>Warning</strong> - Your browser does not support geolocation. Using default values.";
                    warningAlert.html($scope.warningMessages);
                    warningAlert.toggleClass("alertMsg");

                    $scope.postition = {coords: {latitude: defaultVals.latitude, longitude: defaultVals.longitude}};
                    onSuccess($scope.position);
                }
            };

            var onSuccess = function (position) {
                $scope.map = {
                    center: {latitude: position.coords.latitude, longitude: position.coords.longitude},
                    zoom: 14
                };
                $scope.markers.push({
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
                });

                $scope.data = "empty";

                var promise = ngGPlacesAPI.nearbySearch({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                promise.then(function (data) {
                        for (var i=0; i<data.length; i++) {
                            $scope.locationDetails = ngGPlacesAPI.placeDetails({
                                reference: data[i].reference
                            }).then(
                                (function (inner) { return function (data) {
                                    $scope.markers.push({
                                        id: inner+1, //has to be +1, home marker is 0
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
                                        click: function( ) {
                                            if($('#error').html()) {
                                                var errorAlert = $('#error');
                                                errorAlert.html("");
                                                errorAlert.toggleClass('alertMsg');
                                            }
                                            var id = data.name + " located at " + data.formatted_address;
                                            var index = $scope.selectedPlaces.indexOf(id);

                                            if (index > -1) {
                                                removeSelectedPlaceFromList(id);
                                            }
                                            else {
                                                addSelectedPlaceToList(id, data.name, data.formatted_address, data.formatted_phone_number, data.website);
                                            }
                                        }
                                    });
                                };}(i))
                            );
                        }
                        ngProgress.complete();
                    },
                    function (reason) {
                        alert('Failed: ' + reason);
                        ngProgress.reset();
                    },
                    function (update) {
                        alert('Got notification: ' + update);
                    });
            };

            var onError = function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        $scope.errorMessages = "<strong>Error</strong> - Geolocation is disabled for this site. This site requires Geolocation to work properly.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        $scope.errorMessages = "<strong>Error</strong> - Your location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        $scope.errorMessages = "<strong>Error</strong> - The request to get user location timed out.";
                        break;
                    default:
                        $scope.errorMessages = "<strong>Error</strong> - An unknown error has occurred.";
                        break;
                }

                var errorAlert = $("#error");
                errorAlert.html($scope.errorMessages);
                errorAlert.toggleClass("alertMsg");
                ngProgress.complete();
            };

            $scope.getUserLocation(onSuccess, onError);

            var addSelectedPlaceToList = function(id, name, address, phone, website) {
                // Add the id to the places array
                $scope.selectedPlaces.push(id);

                // Get the places container div
                var placesList = document.getElementById("selectedPlaces");

                // Create div to hold place info + button
                var placeItemDiv = document.createElement("div");
                placeItemDiv.setAttribute("id", id.toString());
                placeItemDiv.setAttribute("class", "alert alert-warning alert-dismissible placesItem");
                placeItemDiv.setAttribute("role", "alert");

                // Create close button for place
                var placeItemButton = document.createElement("button");
                placeItemButton.setAttribute("type", "button");
                placeItemButton.setAttribute("class", "close");
                placeItemButton.setAttribute("data-dismiss", "alert");
                placeItemButton.setAttribute("aria-label", "Close");

                // Create span to style close button
                var placeItemSpan = document.createElement("span");
                placeItemSpan.setAttribute("aria-hidden", "true");

                // Create div for place info
                var placeItemInfo = document.createElement("div");
                var placeTitle = document.createElement("strong");
                placeTitle.appendChild(document.createTextNode(name));

                // Create text nodes for place street address and location
                var addressTokens = address.split(",");
                var placeAddress = document.createTextNode(addressTokens[0]);
                var placeLocation = document.createTextNode(addressTokens[1] + "," + addressTokens[2] + "," + addressTokens[3]);

                // Create text node for place phone number
                var placePhone = document.createTextNode(phone);

                // Create text node for place website
                var placeWebsite = document.createElement("a");
                placeWebsite.setAttribute("href", website);
                placeWebsite.setAttribute("target", "_blank");
                placeWebsite.appendChild(document.createTextNode("Website"));

                // Insert formatted place information into info div
                placeItemInfo.appendChild(placeTitle);
                placeItemInfo.appendChild(document.createElement("br"));
                placeItemInfo.appendChild(placeAddress);
                placeItemInfo.appendChild(document.createElement("br"));
                placeItemInfo.appendChild(placeLocation);
                placeItemInfo.appendChild(document.createElement("br"));
                placeItemInfo.appendChild(placePhone);
                placeItemInfo.appendChild(document.createElement("br"));
                placeItemInfo.appendChild(placeWebsite);

                // Insert formatted × into close button
                placeItemSpan.appendChild(document.createTextNode("×"));
                placeItemButton.appendChild(placeItemSpan);

                // Insert formatted text and × into places div
                placeItemDiv.appendChild(placeItemButton);
                placeItemDiv.appendChild(placeItemInfo);

                // Insert the new item into the places list
                placesList.appendChild(placeItemDiv);

                // Add listener to close button for this place item
                placeItemButton.addEventListener("click", function () {
                    removeSelectedPlaceFromList(this.parentNode.id);
                });
            };

            var removeSelectedPlaceFromList = function(id) {
                // Remove the id from the places array
                var index = $scope.selectedPlaces.indexOf(id);
                $scope.selectedPlaces.splice(index, 1);

                // Remove the item from the places list
                document.getElementById(id).remove();
            }
        }
    }
]);
