'use strict';

describe('MainPageController', function () {
    beforeEach(module('lunchr'));
    beforeEach(module('stateMock')); //mock the $state service of ui-router

    var DEFAULT_EMAIL = 'user@user.com';
    var DEFAULT_PASSWORD = 'password';
    var DEFAULT_FIRSTNAME = 'first';
    var DEFAULT_LASTNAME = 'last';

    var $controller, $httpBackend, $rootScope, $state, authService;

    function createController() {
        return $controller('MainPageController', {'$scope': $rootScope, 'authService': authService});
    }

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $state = $injector.get('$state');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        authService = jasmine.createSpyObj('authService', ['setUser']);

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $state.ensureAllTransitionsHappened();
    });

    describe('$scope.logIn', function () {

        it('redirects user to /home on success and logs in user', function () {

            createController();
            $rootScope.email = DEFAULT_EMAIL;
            $rootScope.password = DEFAULT_PASSWORD;

            var response = [{
                firstname: DEFAULT_FIRSTNAME,
                lastname: DEFAULT_LASTNAME
            }];
            $httpBackend.expectPOST('/api/users/authenticate').respond(200, response);
            $state.expectTransitionTo('home');

            $rootScope.logIn();
            $httpBackend.flush();

            expect(authService.setUser).toHaveBeenCalledWith(response);
        });

        it('sets error message on 500', function () {
            var errorMessage = "error Message";
            createController();

            $rootScope.email = DEFAULT_EMAIL;
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();
            $httpBackend.expectPOST('/api/users/authenticate').respond(500, errorMessage);
            $httpBackend.flush();

            expect($rootScope.errorMessages).toBe(errorMessage);
            expect(authService.setUser.calls.any()).toBeFalsy();
        });

        it('does not make post without password', function () {
            createController();
            $rootScope.email = DEFAULT_EMAIL;

            $rootScope.logIn();

            //note do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.setUser.calls.any()).toBeFalsy();
        });

        it('does not make post without email', function () {
            createController();
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();

            //note do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.setUser.calls.any()).toBeFalsy();
        });
    });

    describe('$scope.createAccount', function() {
        it('should always redirect to /register', function() {
            createController();
            $state.expectTransitionTo('register');

            $rootScope.createAccount();
            expect(authService.setUser.calls.any()).toBeFalsy();
        });
    });
});