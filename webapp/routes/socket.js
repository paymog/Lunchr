module.exports = function(socket) {

    socket.on('match', function(data){
        require('sleep').sleep(2);
        socket.emit('matched' + data.user, {name: 'Brandon'});
    })
};