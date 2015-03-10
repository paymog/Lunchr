'use strict';

describe( 'MapController', function( )
{
    beforeEach( module( 'lunchr' ) );

    var $controller, $httpBackend, $rootScope;

    function createController( )
    {
        return $controller( 'MapController' , { '$scope': $rootScope } );
    }

    beforeEach( inject ( function( $injector )
    {
        // Set up the mock http service responses
        $httpBackend = $injector.get( '$httpBackend' );

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get( '$rootScope' );

        // The $controller service is used to create instances of controllers
        $controller = $injector.get( '$controller' );
    } ) );

    afterEach( function( )
    {
        $httpBackend.verifyNoOutstandingExpectation( );
        $httpBackend.verifyNoOutstandingRequest( );
    } );
    
    describe( "$scope.map", function( )
    {
        it ( "Ensure map exists" , function( )
        {
            createController( );
            expect( $rootScope.map ).toBeTruthy( );
        } );
    } );

    describe( "Test HTML5 Geolocation", function( )
    {
        beforeEach( function( )
        {
            createController( );
            var jasmineSuccess = jasmine.createSpy( );
            var jasmineError = jasmine.createSpy( );

            spyOn( navigator.geolocation,"getCurrentPosition" ).and.callFake( function( )
            {
                var position = { coords: { latitude: 12.3456, longitude: -12.3456 } };
                arguments[ 0 ]( position );
            } );

            $rootScope.getUserLocation( jasmineSuccess, jasmineError );
        } );
        
        it ( "executes the function onSuccess with valid data", function( )
        {
            setTimeout( function( )
        {
            expect( jasmineSuccess ).wasCalled( );
            done( );
        }, 500 );
        } );
        
        it ( "executes the function onError to simulate PERMISSION_DENIED", function( )
        {
            // Pass in error code to mimic PERMISSION_DENIED
            
            //setTimeout( function( )
            //{
            //    expect( jasmineError ).wasCalled( );
            //    done( );
            //}, 500 );
        } );

        //it ( "executes the function onError to simulate POSITION_UNAVAILABLE", function( )
        //{
        //
        //} );
        //
        //it ( "executes the function onError to simulate TIMEOUT", function( )
        //{
        //
        //} );
    } );
} );