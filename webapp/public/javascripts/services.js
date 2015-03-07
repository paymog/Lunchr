'use strict';

var lunchrServices = angular.module('lunchrServices', []);

lunchrServices.service('authService', function () {
    var user = null;

    this.login = function (userEmail) {
        user = userEmail;
    };
    this.logout = function () {
        user = null;
    };
    this.currentUser = function(){
        return user;
    }

});

