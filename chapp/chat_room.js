var util = require('util');

var chatRoom = {
    addMessage : function(user, message, callback){
        if(!user)
            callback(new TypeError('user is null'));
        else
            util.put(user + ": " + message);
    }
}

module.exports = chatRoom;