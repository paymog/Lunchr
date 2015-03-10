'use strict';

var lunchrServices = angular.module('lunchrServices', ['ngCookies']);

lunchrServices.service('authService', ['$cookies', function ($cookies) {
    var user = $cookies.lunchr_currentUser || null;

    this.login = function (userEmail) {
        user = userEmail;
        $cookies.lunchr_currentUser = userEmail;
    };
    
    this.logout = function () {
        user = null;
        $cookies.lunchr_currentUser = null;
    };

    this.currentUser = function () {
        return user;
    }
}]);

