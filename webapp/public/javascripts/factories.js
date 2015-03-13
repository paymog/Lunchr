var lunchrFactories = angular.module('lunchrFactories', []);

lunchrFactories.factory('socket', function (socketFactory) {
    return socketFactory();
});