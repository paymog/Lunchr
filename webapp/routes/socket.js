module.exports = function(socket) {

    socket.on('match', function(data){
        require('sleep').sleep(2);
        console.log(data.user);
        socket.emit('matched' + data.user, {name: 'Brandon'});
    })
};