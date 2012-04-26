var chatRoomController = {
    create: function(request, response) {
        return Object.create(this, {
            request : { value : request },
            response : {value : response}
        });
    },
    post : function(){
        var body = '';
        this.request.addListener('data', function(chunk){
           body += chunk;
        });
        this.request.addListener('end', function(){
           JSON.parse(decodeURI(body));
        });
    }
};

module.exports = chatRoomController;