var util = require('util');

var chatRoom = {
    addMessage : function(user, message, callback){
        var err = null;
        if(!user)
            err = new TypeError('user is null');
        else if(!message)
            err = new TypeError('message is null');

        var data;
        if(!err){
            if(!this.messages)
                this.messages = [];

            var id = this.messages.length + 1;
            data = {id : id++, user : user, message : message};
            this.messages.push(data);
        }

        if(typeof callback == 'function'){
            callback(err, data);
        }
    },
    getMessagesSince : function(id, callback){
        if(!this.messages)
            this.messages = [];

        callback(null, this.messages.slice(id));
    }
}

module.exports = chatRoom;