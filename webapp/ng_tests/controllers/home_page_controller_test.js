'use strict';

describe('HomePageController', function () {
    beforeEach(module('lunchr'));

    var DEFAULT_EMAIL = 'amy@mail.com';
    var DEFAULT_FIRSTNAME = 'Amy';
    var DEFAULT_LASTNAME = 'Last';

    var $controller, $httpBackend, $rootScope, authService;

    function createController() {
        return $controller('HomePageController', {'$scope': $rootScope, 'authService': authService});
    }

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        authService = jasmine.createSpyObj('authService', ['currentUser']);
        authService.currentUser.and.returnValue(DEFAULT_EMAIL);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('on initialization', function() {
        it('sets $scope.name based on call to db using authService', function() {

            $httpBackend.expectGET('api/users?email=' + DEFAULT_EMAIL).respond(200, [{firstname: DEFAULT_FIRSTNAME, lastname: DEFAULT_LASTNAME}]);
            //not sure why this main.jade is GET, but apparently it wants in on the test action
            $httpBackend.expectGET('/partials/main.jade').respond(200,'');

            createController();
            $httpBackend.flush();

            expect(authService.currentUser).toHaveBeenCalled();
            expect($rootScope.name).toBe((DEFAULT_FIRSTNAME+" "+DEFAULT_LASTNAME));
        })
    });
});