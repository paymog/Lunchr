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

    describe ( "$scope.map and geolocation", function( )
    {
        it ( "executes the function onSuccess with valid data", function( )
        {

        } );
    } );
} );