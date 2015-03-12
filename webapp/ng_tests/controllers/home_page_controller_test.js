'use strict';

describe('HomePageController', function () {
    beforeEach(module('lunchr'));
    beforeEach(module('stateMock'));

    var DEFAULT_FIRSTNAME = 'Amy';
    var DEFAULT_LASTNAME = 'Last';

    var $controller, $httpBackend, $rootScope, $state;

    function createController(authService) {
        return $controller('HomePageController', {'$scope': $rootScope, 'authService': authService});
    }

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        $state = $injector.get('$state');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $state.ensureAllTransitionsHappened();
    });

    describe('on initialization', function() {
        it('sets $scope.name based on call to db using authService', function() {

            var authService = jasmine.createSpyObj('authService', ['currentUser']);
            authService.currentUser.and.returnValue({firstname: DEFAULT_FIRSTNAME, lastname: DEFAULT_LASTNAME});
            createController(authService);

            expect(authService.currentUser).toHaveBeenCalled();
            expect($rootScope.name).toBe((DEFAULT_FIRSTNAME+" "+DEFAULT_LASTNAME));
        });

        it('navigates to matching when matchedWith is set in cookie', function() {
            var authService = jasmine.createSpyObj('authService', ['currentUser']);
            authService.currentUser.and.returnValue({matchedWith: DEFAULT_FIRSTNAME});

            $state.expectTransitionTo('home.matched');

            createController(authService);
        });

        it('navigates to matching when matching is set in cookie', function() {
            var authService = jasmine.createSpyObj('authService', ['currentUser']);
            authService.currentUser.and.returnValue({wantsToBeMatched: true});

            $state.expectTransitionTo('home.matching');

            createController(authService);
        });
    });
});