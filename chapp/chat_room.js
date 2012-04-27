var util = require('util');

var chatRoom = {
    addMessage : function(user, message, callback){
        var err = null;
        if(!user)
            err = new TypeError('user is null');
        else if(!message)
            err = new TypeError('message is null');

        if(typeof callback == 'function'){
            callback(err);
        }
    }
}

module.exports = chatRoom;