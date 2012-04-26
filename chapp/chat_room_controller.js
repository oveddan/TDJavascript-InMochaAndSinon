var chatRoomController = {
    create: function(request, response) {
        return Object.create(this, {
            request : { value : request },
            response : {value : response}
        });
    }
};

module.exports = chatRoomController;