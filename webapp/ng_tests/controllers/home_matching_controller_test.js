'use strict';

describe('HomeMatchingController', function () {
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

        authService = jasmine.createSpyObj('authService', ['currentUser', 'setUser']);
        authService.currentUser.and.returnValue({email: CURRENT_USER });
    }));

    afterEach(function () {
        $state.ensureAllTransitionsHappened();
    });

    function createController() {
        return $controller('HomeMatchingController', {
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

            $state.expectTransitionTo('home.matched');
            socket.receive('matched' + CURRENT_USER, {name: MATCHED_USER});

            expect(authService.currentUser).toHaveBeenCalled();
            expect(authService.setUser).toHaveBeenCalled();
        });

        it('should update the user cookie on hasBeenMatched', function(){
            createController();

            var userResponse = {user: { email: CURRENT_USER}};
            socket.receive('hasBeenMatched', userResponse);

            expect(authService.setUser).toHaveBeenCalledWith(userResponse.user)
        })
    })
});