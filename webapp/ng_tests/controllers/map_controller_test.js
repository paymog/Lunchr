'use strict';

describe( 'MapController', function( )
{
    beforeEach( module( 'lunchr' ) );

    var DEFAULT = 'name';

    var $controller, $httpBackend, $rootScope, authService;

    function createController()
    {
        return $controller( 'MapController' , { '$scope': $rootScope, 'authService': authService } );
    }

    beforeEach( inject ( function( $injector )
    {
        // Set up the mock http service responses
        $httpBackend = $injector.get( '$httpBackend' );

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get( '$rootScope' );

        // The $controller service is used to create instances of controllers
        $controller = $injector.get( '$controller' );

        //create authService
        authService = jasmine.createSpyObj('authService', ['currentUser']);
        authService.currentUser.and.returnValue({firstname: DEFAULT});
    } ) );
    
    describe( "$scope.map", function( )
    {
        it ( "Ensure map exists" , function( )
        {
            $httpBackend.expectGET('/partials/main.jade').respond(200);
            createController();
            expect( $rootScope.map ).toBeTruthy( );
        } );
    } );

    describe( "Test HTML5 Geolocation", function( )
    {
        beforeEach(function () {
            $httpBackend.expectGET('/partials/main.jade').respond(200);
            createController();
        });
        
        it ( "executes the function onSuccess with valid data", function( )
        {
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );
            
            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var position = { coords: { latitude: 12.3456, longitude: -12.3456 } };
                arguments[ 0 ]( position );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );
            
            setTimeout( function( )
            {
                expect( jasmineSuccess ).wasCalled( );
                done( );
            }, 500 );
        } );
        
        it ( "executes the function onError to simulate PERMISSION_DENIED", function( )
        {
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );
            
            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var PERMISSION_DENIED = 1;
                var error = { code: PERMISSION_DENIED };
                
                arguments[ 0 ]( error );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );

            setTimeout( function( )
            {
                expect( jasmineError ).wasCalled( );
                done( );
            }, 500 );
        } );

        it ( "executes the function onError to simulate POSITION_UNAVAILABLE", function( )
        {
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );

            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var POSITION_UNAVAILABLE = 2;
                var error = { code: POSITION_UNAVAILABLE };

                arguments[ 0 ]( error );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );

            setTimeout( function( )
            {
                expect( jasmineError ).wasCalled( );
                done( );
            }, 500 );
        } );
        
        it ( "executes the function onError to simulate TIMEOUT", function( )
        {
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );

            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var TIMEOUT = 3;
                var error = { code: TIMEOUT };

                arguments[ 0 ]( error );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );

            setTimeout( function( )
            {
                expect( jasmineError ).wasCalled( );
                done( );
            }, 500 );
        } );
        
        it ( "executes the function onError to similate an unknown error", function( )
        {
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );

            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var UNKNOWN_ERROR = 4;
                var error = { code: UNKNOWN_ERROR };

                arguments[ 0 ]( error );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );

            setTimeout( function( )
            {
                expect( jasmineError ).wasCalled( );
                done( );
            }, 500 );
        } );
    } );
} );