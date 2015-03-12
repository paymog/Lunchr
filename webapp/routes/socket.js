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
                currentUser.password = null;
                socket.emit('hasBeenMatched', {user: JSON.stringify(currentUser)})
            });

        });

        User.find({email: {'$ne': data.userEmail }, wantsToBeMatched: true}, function(error, users){
            if(error || users.length == 0){
                //bleh
                return
            }

            var userToMatch = users[0];

            userToMatch.wantsToBeMatched = false;
            currentUser.wantsToBeMatched = false;

            userToMatch.matchedWith = currentUser.firstname + " " + currentUser.lastname;
            currentUser.matchedWith = userToMatch.firstname + " " + userToMatch.lastname;

            userToMatch.save(function(err) {
                if(err) {
                    console.log('Could not save user: ' + userToMatch);
                    console.log(err);
                    return;
                }
            });
            currentUser.save(function(err) {
                if(err) {
                    console.log('Could not save user' + currentUser);
                    console.log(err);
                    return;
                }
            });

            userToMatch.password = null;
            currentUser.password = null;
            socket.broadcast.emit('matched' + userToMatch.email, {user: JSON.stringify(userToMatch)});
            socket.emit('matched' + currentUser.email, {user: JSON.stringify(currentUser)});

        });
    })
};