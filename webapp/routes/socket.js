var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(socket) {
    socket.on('match', function(data){

        var currentUser = null;
        User.findOne({email: data.userEmail}, function(error, user) {
            if(error){
                return;
            }

            if(!user) {
                console.log("Could not find user with email " + data.userEmail);
                return;
            }

            currentUser = user;
            currentUser.wantsToBeMatched = true;
            currentUser.save(function(err){
                if(err) {
                    console.log('Could not save user: ' + currentUser);
                    console.log(err);
                    return;
                }
                var password = currentUser.password;
                currentUser.password = null;
                socket.emit('hasBeenMatched', {user: JSON.stringify(currentUser)});
                currentUser.password = password;
            });

        });

        User.find({email: {'$ne': data.userEmail }, wantsToBeMatched: true}, function(error, users){
            if(error || users.length == 0){
                //If no matching user found
                return;
            }

            var userToMatch = users[0];
            var restaurantMatch = false;
            var pos = 0;
            
            while ( restaurantMatch == false && pos < currentUser.restaurants.length )
            {            
                if ( currentUser.indexOf( userToMatch[ pos ] ) )
                {
                    restaurantMatch = true;
                    console.log( userToMatch[ pos ] );
                }
                
                pos++;
            }

            userToMatch.wantsToBeMatched = false;
            currentUser.wantsToBeMatched = false;

            userToMatch.matchedWith = currentUser.firstname + " " + currentUser.lastname;
            currentUser.matchedWith = userToMatch.firstname + " " + userToMatch.lastname;

            userToMatch.save(function(err) {
                if(err) {
                    console.log('Could not save user: ' + userToMatch);
                    console.log(err);
                    //return; //redundant because nothing else after
                }
            });
            currentUser.save(function(err) {
                if(err) {
                    console.log('Could not save user' + currentUser);
                    console.log(err);
                    //return; //redundant because nothing else after
                }
            });
            var matchPassword = userToMatch.password;
            var currPassword = currentUser.password;
            userToMatch.password = null;
            currentUser.password = null;
            socket.broadcast.emit('matched' + userToMatch.email, {user: JSON.stringify(userToMatch)});
            socket.emit('matched' + currentUser.email, {user: JSON.stringify(currentUser)});
            userToMatch.password = matchPassword;
            currentUser.password = currPassword;

        });
    })
};