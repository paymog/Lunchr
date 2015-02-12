describe('MainPageController', function () {
    beforeEach(module('lunchr'));

    var DEFAULT_USERNAME = 'user';
    var DEFAULT_PASSWORD = 'password';

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
            return $controller('MainPageController', {'$scope': $rootScope});
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('$scope.logIn', function () {
        it('redirects user to /users on success', function () {

            var controller = createController();
            $rootScope.email = DEFAULT_USERNAME;
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();
            $httpBackend.expectPOST('/api/users/authenticate').respond(200, '');
            $httpBackend.flush();

            expect($location.path()).toBe('/users');
        });

        it('sets error message on 500', function () {
            var errorMessage = "error Message";
            var controller = createController();

            $rootScope.email = DEFAULT_USERNAME;
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();
            $httpBackend.expectPOST('/api/users/authenticate').respond(500, errorMessage);
            $httpBackend.flush();

            expect($rootScope.errorsMessages).toBe(errorMessage);
            expect($location.path()).toBe('/')
        });

        it('does not make post without email', function () {
            var controller = createController();
            $rootScope.email = DEFAULT_PASSWORD;

            $rootScope.logIn();

            //note do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorsMessages).toBeFalsy();
        });

        it('does not make post without password', function () {
            var controller = createController();
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();

            //note do not expectPOST

            expect($location.path()).toBe('/');
            expect($rootScope.errorsMessages).toBeFalsy();
        })
    });

    describe('$scope.createAccount', function() {
        it('should always redirect to /register', function() {
            createController();

            $rootScope.createAccount();

            expect($location.path()).toBe('/register')
        })
    })
});