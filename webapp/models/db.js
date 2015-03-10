var mongoose = require('mongoose');

mongoose.model('User', {
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    age: Number,
    radius: String,
    wantsToBeMatched: Boolean,
    matchedWith: String
});
mongoose.connect('mongodb://localhost:27017/lunchr');