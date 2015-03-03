module.exports = function(socket) {

    socket.on('match', function(data){
        require('sleep').sleep(2);
        socket.emit('matched', {name: 'Brandon'});
    })
};