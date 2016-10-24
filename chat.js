/*  Copyright (c) http://socket.io/get-started/chat/ 

    MIT Licensed. See LICENSE for full license.
    Usage : node chat.js
*/
var COMMANDS = {
    "LOGIN"     : "#nick:"
},
EVENTS = { //  come from client
    "LOGIN"     : "loggedInEvent",
    "MESSAGE"   : "messageEvent",
    "USER_POPS" : "userApperedEvent"
},
ACTIONS = { // sent to client
    "LOGIN"     : "loginAction",
    "LOGOUT"    : "logoutAction",
    "RENAME"    : "renameAction",
    "MESSAGE"   : "messageAction",
    "USER_POPS" : "userApperedAction"
},
SHARED_DATA = {
    "COMMANDS": COMMANDS,
    "ACTIONS" : ACTIONS,
    "EVENTS" : EVENTS
};

var gameport        = process.env.PORT || 8080;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var cl = function(){console.log(arguments);};
http.listen(gameport, function(){
    // console.log('listening on *:'+ gameport);
    app.get('/', function(request, result){
        // if (!logged in){
        // result.send('<h1>Hello world</h1>'); //login
        //}
      result.sendFile( __dirname + '/chat.html' );
    });

    io.on('connection', function(socket){
        var user = {
            "oldId" : null,
            "id"    : null,
            "logged": false
        };
        // console.log('user connected');
        socket.emit("config", JSON.stringify(SHARED_DATA));
        socket.emit(ACTIONS.LOGIN);

        //login
        socket.on(EVENTS.LOGIN, function(message){
            var loginPrefixPosition = message.indexOf(COMMANDS.LOGIN);
            if (loginPrefixPosition != -1) {
                // console.log(user.id, message);
                user.oldId = user.id;

                user.id = message.slice(loginPrefixPosition + COMMANDS.LOGIN.length);
                if (user.id.length == 0) {
                    user.id = user.oldId;
                }
                if (user.id === null) {
                    user.logged = false;
                } else {
                    user.logged = true;
                    if (user.oldId == user.id) {
                        //not changed
                    } else if (user.oldId != null) {
                        socket.emit(ACTIONS.RENAME, {"old":user.oldId, "id":user.id});
                    } else {
                        socket.emit(ACTIONS.LOGIN , {"old":null, "id":user.id});
                    }
                }
            } else {
                socket.emit(ACTIONS.LOGIN, null);
            }
        });
        //logout
        socket.on('disconnect', function(){
            // console.log('user disconnected');
            if (user.logged && user.id !== null) {
                io.emit(ACTIONS.LOGOUT , {id:user.id});
            }
        });

        //chat
        socket.on(EVENTS.USER_POPS, function(){
            if (user.logged) {
                io.emit(ACTIONS.USER_POPS , {"id":user.id});
            }
        });
        //chat
        socket.on(EVENTS.MESSAGE, function(data){
            if (user.logged) {
                io.emit(ACTIONS.MESSAGE , {"message":data.message, "id":user.id});
            }
        });
    });
});
