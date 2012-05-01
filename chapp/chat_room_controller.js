//require('function-bind');

var chatRoomController = {
    create: function(request, response) {
        return Object.create(this, {
            request : { value : request },
            response : {value : response}
        });
    },
    get : function(){
        var id = this.request.headers['x-access-token'] || 0;
        this.chatRoom.waitForMessagesSince(id);
    },
    post : function(){
        var body = '';
        this.request.addListener('data', function(chunk){
           body += chunk;
        });
        this.request.addListener('end', function(){
           var data = JSON.parse(decodeURI(body)).data;
           this.chatRoom.addMessage(data.user, data.message).then(function(){
               this.response.writeHead(201);
               this.response.end();
           }.bind(this));
        }.bind(this));
    }
};

module.exports = chatRoomController;