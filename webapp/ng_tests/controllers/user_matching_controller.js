'use strict';

describe('UserMatchingController', function () {
    beforeEach(module('lunchr'));
    beforeEach(module('stateMock'));


    var $controller, $rootScope, $state, socket;

    beforeEach(inject(function ($injector) {
        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $state = $injector.get('$state');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        socket = new sockMock($rootScope);

    }));

    afterEach(function () {
        $state.ensureAllTransitionsHappened();
    });

    function createController() {
        return $controller('UserMatchingController', {'$scope': $rootScope, 'socket':socket });
    }

    describe('on initialization', function(){
        it('socket should emit a match', function() {
            createController();

            expect(socket.emits['match'].length).toBe(1);
        });

        it('should transition to users.matched upon receiving matched', function(){
            createController();

            $state.expectTransitionTo('users.matched');
            socket.receive('matched', {name: 'name'});
        })
    })
});