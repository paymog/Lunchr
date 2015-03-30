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
            currentUser.restaurants = data.restaurants;
            currentUser.save(function(err){
                if(err) {
                    console.log('Could not save user: ' + currentUser);
                    console.log(err);
                    return;
                }
                var password = currentUser.password;
                currentUser.password = null;
                socket.emit('hasBeenMatched', {user: currentUser});
                currentUser.password = password;
            });

        });

        User.find({email: {'$ne': data.userEmail }, wantsToBeMatched: true}, function(error, users){
            if(error || users.length == 0){
                //If no matching user found
                return;
            }

            var userToMatch = null;
            var restaurantMatch = false;
            for(var i=0; i<users.length && !restaurantMatch; i++) {
                if(currentUser.restaurants.length==0 && users[i].restaurants.length != 0)
                {
                    //if user requesting match has no restaurant selected -> any match
                    userToMatch = users[i];
                    restaurantMatch = setMatch(currentUser,userToMatch,0);
                }
                if(currentUser.restaurants.length!=0 && users[i].restaurants.length ==0)
                {
                    //if user found has no restaruant selected -> they are a match
                    userToMatch = users[i];
                    restaurantMatch = setMatch(userToMatch, currentUser, 0);
                }
                if (currentUser.restaurants != null && users[i].restaurants != null) {

                    for (var pos = 0; !restaurantMatch && pos < currentUser.restaurants.length; pos++) {
                        var index = users[i].restaurants.indexOf(currentUser.restaurants[pos]);

                        if (index > -1) {
                            userToMatch = users[i];
                            restaurantMatch = setMatch(userToMatch, currentUser, pos);
                        }
                    }
                }
            }
            if(!restaurantMatch)
                return;

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
            socket.broadcast.emit('matched' + userToMatch.email, {user: userToMatch});
            socket.emit('matched' + currentUser.email, {user: currentUser});
            userToMatch.password = matchPassword;
            currentUser.password = currPassword;

        });
    });

    socket.on('finished', function(data) {
        User.findOne({email: data.userEmail}, function(error, user) {
            if(error)
                return;

            if(!user) {
                console.log("Could not find user with email" + data.userEmail);
                return;
            }

            user.wantsToBeMatched = false;
            user.matchedWith = "";
            user.restaurants = [];
            user.meetingPlace = "";
            user.save(function(err) {
                if(err) {
                    console.log("Could not save user " + user);
                    console.log(err);
                }
                socket.emit("updated", {user: user})
            });
        });
    });
};

function setMatch(currentUser, userToMatch, index) {
    userToMatch.meetingPlace = userToMatch.restaurants[index];
    currentUser.meetingPlace = userToMatch.meetingPlace;
    console.log("Matched restaurant is " + currentUser.meetingPlace);
    return true;
}