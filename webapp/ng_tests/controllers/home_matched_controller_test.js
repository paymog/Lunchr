'use strict';

describe('HomeMatchedController', function () {
    beforeEach(module('lunchr'));

    var FIRST_NAME = 'Ben';
    var LAST_NAME = 'Bob';

    var $controller, $rootScope, authService;

    function createController() {
        return $controller('HomeMatchedController', {$scope: $rootScope, authService: authService});
    }

    beforeEach(inject(function ($injector) {

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        authService = jasmine.createSpyObj('authService', ['currentUser']);
        authService.currentUser.and.returnValue({matchedWith: FIRST_NAME});
    }));

    describe('on initialization', function() {
        it('sets $scope.name based on authService', function() {
            createController();

            expect(authService.currentUser).toHaveBeenCalled();
            expect($rootScope.name).toBe(FIRST_NAME);
        });
    })
});