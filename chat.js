/*  Copyright (c) http://socket.io/get-started/chat/ 

    MIT Licensed. See LICENSE for full license.
    Usage : node ninja.js
*/

var gameport        = process.env.PORT || 8080;
var NICK_NAME_CHANGE_PREFIX = "#nick:";
var COMMON_MESSAGE_EVENT = "message";
var COMMON_NICKNAME_EVENT = "nickname";
var REQUEST_LOGIN = 'Please enter your nick name to enter the chat:\nUse: "#nick:" followed by a name';
var NOTIFY_USER_CONNECTED = " has just connected! Welcome him / her";
var NOTIFY_USER_CHANGED_ID = " renamed their nickname to: ";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    // if (!logged in){
    // res.send('<h1>Hello world</h1>'); //login
    //}
  res.sendFile( __dirname + '/chat.html' );
});

io.on('connection', function(socket){
    // console.log('A user connected');
    var userId = null;
    var logged = false;
    socket.emit(COMMON_MESSAGE_EVENT, REQUEST_LOGIN);

    //logout
    socket.on('disconnect', function(){
        if (logged && userId!==null) {
            io.emit(COMMON_MESSAGE_EVENT , userId + ' has left.');
        }
    });

    //login
    socket.on(COMMON_NICKNAME_EVENT, function(msg){
        var oldId = userId;
        var isNickNameFoundAt = msg.indexOf(NICK_NAME_CHANGE_PREFIX);
        userId = msg.slice(isNickNameFoundAt + NICK_NAME_CHANGE_PREFIX.length);
        if (oldId === null) {
            logged = true;
            io.emit(COMMON_MESSAGE_EVENT , userId + NOTIFY_USER_CONNECTED);
        } else {
            io.emit(COMMON_MESSAGE_EVENT , oldId + NOTIFY_USER_CHANGED_ID + userId);
        }
    });
    //chat
    socket.on(COMMON_MESSAGE_EVENT, function(msg){
        console.log('message: ' + msg);
        io.emit(COMMON_MESSAGE_EVENT , msg);
    });
});

http.listen(gameport, function(){
  console.log('listening on *:'+ gameport);
});
