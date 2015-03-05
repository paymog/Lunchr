var lunchrFactories = angular.module('lunchrFactories', []);

lunchrFactories.factory('socket', function (socketFactory) {
    return socketFactory();
});

lunchrFactories.factory( 'authService', function() {
    var currentUser;

    return {
        login: function(userEmail) { currentUser = userEmail },
        logout: function() { currentUser = NULL },
        currentUser: function() { return currentUser; }
    };
});