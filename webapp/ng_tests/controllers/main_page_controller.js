
describe('MainPageController', function() {
    beforeEach(module('lunchr'));

    var DEFAULT_USERNAME = 'user';
    var DEFAULT_PASSWORD = 'password';

    var $controller, $httpBackend, $rootScope, $location;

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        $location = $injector.get('$location');

        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('MainPageController', {'$scope' : $rootScope });
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('$scope.logIn', function() {
        it('redirects user to /users on success', function() {
            $httpBackend.expectPOST('/api/users/authenticate').respond(200, '');

            var controller = createController();
            $rootScope.email = DEFAULT_USERNAME;
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();
            $httpBackend.flush();

            expect($location.path()).toBe('/users');
        });

        it('sets error message on 500', function(){
            var errorMessage = "error Message";
            $httpBackend.expectPOST('/api/users/authenticate').respond(500, errorMessage);

            var controller = createController();
            $rootScope.email = DEFAULT_USERNAME;
            $rootScope.password = DEFAULT_PASSWORD;

            $rootScope.logIn();
            $httpBackend.flush();

            expect($rootScope.errorsMessages).toBe(errorMessage);
            expect($location.path()).toBe('/')
        })
    });
});