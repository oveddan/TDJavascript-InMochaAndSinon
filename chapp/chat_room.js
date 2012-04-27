var util = require('util');

var chatRoom = {
    addMessage : function(user, message, callback){
        if(!user)
            callback(new TypeError('user is null'));
        else if(!message)
            callback(new TypeError('message is null'));
        else
            console.log(user + ": " + message);
    }
}

module.exports = chatRoom;