var mongoose = require( 'mongoose' );

mongoose.model( 'User', {
    email : String,
    password: String
} );
mongoose.connect( 'mongodb://localhost:27017/lunchr' );