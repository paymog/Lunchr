describe('RegisterController', function () {
    beforeEach(module('lunchr'));

    var DEFAULT_EMAIL = 'email';
    var DEFAULT_PASSWORD = 'password';
    var DEFAULT_FIRST_NAME = 'bob';
    var DEFAULT_LAST_NAME = 'johnson';

    var $controller, $httpBackend, $rootScope, $location;

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $location = $injector.get('$location');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        createController = function () {
            return $controller('RegisterController', {'$scope': $rootScope});
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function setDefaultScopeValues() {
        $rootScope.email = DEFAULT_EMAIL;
        $rootScope.password = DEFAULT_PASSWORD;
        $rootScope.firstname = DEFAULT_FIRST_NAME;
        $rootScope.lastname = DEFAULT_LAST_NAME;
    }

    describe('$scope.register', function () {
        it('redirects to /users on success', function () {
            createController();
            setDefaultScopeValues();

            $rootScope.register();
            $httpBackend.expectPOST('/api/users/register', {
                email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD,
                firstname: DEFAULT_FIRST_NAME,
                lastname: DEFAULT_LAST_NAME
            }).respond(200, '');
            $httpBackend.flush();

            expect($location.path()).toBe('/users');
            expect($rootScope.errorMessages).toBeFalsy();
        });

        it('does not post with missing email', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.email = null;

            $rootScope.register();

            //do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorMessages).toBeFalsy();
        });

        it('does not post with missing password', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.password = null;

            $rootScope.register();

            //do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorMessages).toBeFalsy();
        });

        it('does not post with missing first name', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.firstname = null;

            $rootScope.register();

            //do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorMessages).toBeFalsy();
        });

        it('does not post with missing last name', function() {
            createController();
            setDefaultScopeValues();

            $rootScope.lastname = null;

            $rootScope.register();

            //do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorMessages).toBeFalsy();
        });

        it('should display an error message on 500', function() {
            createController();
            setDefaultScopeValues();
            var errorMessage = 'error message';

            $rootScope.register();

            $httpBackend.expectPOST('/api/users/register').respond(500, errorMessage);
            $httpBackend.flush();

            expect($location.path()).toBe('/');
            expect($rootScope.errorMessages).toBe(errorMessage)
        })

    })

});