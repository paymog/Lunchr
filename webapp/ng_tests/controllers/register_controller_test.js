'use strict';

describe('RegisterController', function () {
    beforeEach(module('lunchr'));
    beforeEach(module('stateMock'));

    var DEFAULT_EMAIL = 'email';
    var DEFAULT_PASSWORD = 'password';
    var DEFAULT_FIRST_NAME = 'bob';
    var DEFAULT_LAST_NAME = 'johnson';
    var DEFAULT_AGE = '25';
    var DEFAULT_RADIUS = '5';

    var $controller, $httpBackend, $rootScope, $state, authService;

    function createController() {
        return $controller('RegisterController', {'$scope': $rootScope, 'authService':authService});
    }

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $state = $injector.get('$state');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        authService = jasmine.createSpyObj('authService', ['login']);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $state.ensureAllTransitionsHappened();
    });

    function setDefaultScopeValues() {
        $rootScope.email = DEFAULT_EMAIL;
        $rootScope.password = DEFAULT_PASSWORD;
        $rootScope.firstname = DEFAULT_FIRST_NAME;
        $rootScope.lastname = DEFAULT_LAST_NAME;
        $rootScope.age = DEFAULT_AGE;
        $rootScope.radius = DEFAULT_RADIUS;
    }

    describe('$scope.register', function () {
        it('redirects to /users on success and logs in user and casts age and radius to Number', function () {
            createController();
            setDefaultScopeValues();

            $httpBackend.expectPOST('/api/users/register', {
                email: DEFAULT_EMAIL,
                password: DEFAULT_PASSWORD,
                firstname: DEFAULT_FIRST_NAME,
                lastname: DEFAULT_LAST_NAME,
                age: Number(DEFAULT_AGE),
                radius: Number(DEFAULT_RADIUS)
            }).respond(200, '');
            $state.expectTransitionTo('users');

            $rootScope.register();
            $httpBackend.flush();

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login).toHaveBeenCalledWith(DEFAULT_EMAIL);
        });

        it('does not post with missing email', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.email = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('does not post with missing password', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.password = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('does not post with missing first name', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.firstname = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('does not post with missing last name', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.lastname = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('does not post with missing age', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.age = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('does not post with missing radius', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.radius = null;

            $rootScope.register();

            //do not expectPOST

            expect($rootScope.errorMessages).toBeFalsy();
            expect(authService.login.calls.any()).toBeFalsy();
        });

        it('should display an error message on 500', function() {
            createController();
            setDefaultScopeValues();
            var errorMessage = 'error message';

            $rootScope.register();

            $httpBackend.expectPOST('/api/users/register').respond(500, errorMessage);
            $httpBackend.flush();

            expect($rootScope.errorMessages).toBe(errorMessage);
            expect(authService.login.calls.any()).toBeFalsy();
        })

    })

});