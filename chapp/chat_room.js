var util = require('util'),
    Promise = require('node-promise').Promise,
    id = 0;

var chatRoom = {
    addMessage : function(user, message, callback){
        var promise = new Promise();
        process.nextTick(function(){
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
                promise.resolve(data);
            }

            if(typeof callback == 'function'){
                callback(err, data);
            }

            if(err)
                promise.reject(err, true);

        }.bind(this));

       return promise;
    },
    getMessagesSince : function(id, callback){
        if(!this.messages)
            this.messages = [];

        if(typeof callback == 'function'){
            callback(null, this.messages.slice(id));
        }
    }
}

module.exports = chatRoom;