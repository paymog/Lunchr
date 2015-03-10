'use strict';

describe('UserMatchingController', function () {
    beforeEach(module('lunchr'));
    beforeEach(module('stateMock'));

    var CURRENT_USER = 'bob@gmail.com';
    var MATCHED_USER = 'evan@gmail.com';

    var $controller, $rootScope, $state, socket, authService;


    beforeEach(inject(function ($injector) {
        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $state = $injector.get('$state');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        socket = new socketMock($rootScope);

        authService = jasmine.createSpyObj('authService', ['currentUser']);
        authService.currentUser.and.returnValue({email: CURRENT_USER});
    }));

    afterEach(function () {
        $state.ensureAllTransitionsHappened();
    });

    function createController() {
        return $controller('UserMatchingController', {
            '$scope': $rootScope,
            'socket': socket,
            'authService': authService
        });
    }

    describe('on initialization', function () {
        it('socket should emit a match', function () {

            createController();

            expect(socket.emits['match'][0][0]).toEqual({userEmail: CURRENT_USER});
            expect(authService.currentUser).toHaveBeenCalled();
        });

        it('should transition to users.matched upon receiving matched', function () {
            createController();

            $state.expectTransitionTo('users.matched');
            socket.receive('matched' + CURRENT_USER, {name: MATCHED_USER});

            expect(authService.currentUser).toHaveBeenCalled();
        })
    })
});