'use strict';

var lunchrServices = angular.module('lunchrServices', ['ngCookies']);

lunchrServices.service('authService', ['$cookies', function ($cookies) {
    var user = angular.fromJson($cookies.lunchr_currentUser) || null;

    this.setUser = function (userToSave) {
        user = userToSave;
        $cookies.lunchr_currentUser = angular.toJson(user);
    };
    
    this.removeUser = function () {
        user = null;
        $cookies.lunchr_currentUser = null;
    };

    this.currentUser = function () {
        return user;
    }
}]);

