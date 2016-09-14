$(document).ready(function() {
    var socket = io();
    var name = $('#name');
    var message = $('#message');
    var updates = $('#updates');
    var messages = $('#messages');
    var type = $('#typing');
    var hideTimeout = null;
    
    $('#message').hide();
    
    //function to add new user and list them
    /*var addUser = function(username) {
        users.append('<div>' + username + ' ' + '</div>');
    };*/
    
    //function to show new users joining the chat
    var userUpdate = function(name) {
        updates.append('<div>' + name + ' has joined the chat' + '</div>');
    };
    
    //function to show messages
    var addMessage = function(user, message) {
        messages.append('<div>' + user + ' says: ' + message + '</div>');
    };
    
    //function to show typing
    var showTyping = function(typer) {
        type.html('<div>' + typer + ' is typing' + '</div>');
    };
    
    //function to hide typing
    var hideTyping = function() {
        window.clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
            type.html('');
        }, 1000);
    };
    
    //add new users and show updates to all connected sockets
    name.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        
        var username = $('#name').val();
        var name = username;
        
        userUpdate(name);
        socket.emit('update', name);
        $('#message').show();
        
    });
    
    //add new messages and show to all connected sockets    
    message.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = $('#message').val();
        var user = $('#name').val();
        
        addMessage(user, message);
        socket.emit('message', user, message);
        $('#message').val('');
        $('#typing').html('');
        
    });
    
    //show user typing to all connected sockets except current
    message.on('keydown', function(event) {
        if (event.keyCode != 13) {
            
            var typer = $('#name').val();
        
            showTyping(typer);
            socket.emit('typing', typer);
            
            hideTyping();
            socket.emit('nottyping');
        }
        
    });
    
    //listeners for user and message updates
    socket.on('update', userUpdate);
    socket.on('message', addMessage);
    socket.on('typing', showTyping);
    socket.on('nottyping', hideTyping);
    
})