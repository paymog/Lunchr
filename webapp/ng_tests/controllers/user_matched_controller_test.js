'use strict';

describe('UserMatchedController', function () {
    beforeEach(module('lunchr'));

    var DEFAULT_NAME = 'Ben';

    var $controller, $rootScope;

    function createController(stateParams) {
        return $controller('UserMatchedController', {$scope: $rootScope, $stateParams: stateParams});
    }

    beforeEach(inject(function ($injector) {

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');
    }));

    describe('on initialization', function() {
        it('sets $scope.name based on $stateParams', function() {
            createController({name: DEFAULT_NAME});

            expect($rootScope.name).toBe(DEFAULT_NAME);
        })
    })
});