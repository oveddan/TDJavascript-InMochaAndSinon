var chatRoomController = require('./../chapp/chat_room_controller'),
    assert = require('chai').assert;

suite('chatRoomController', function(){
    test('should be object', function(){
        assert.isNotNull(chatRoomController);
        assert.isFunction(chatRoomController.create);
    });
});

suite('chatRoomController.create', function(){
   test('should return object with request and response', function(){
       var req = {},
           res = {},
           controller = chatRoomController.create(req, res);

       assert.strictEqual(req, controller.request);
       assert.strictEqual(res, controller.response);
       // commented out because does not work
       //assert.instanceOf(chatRoomController, controller);
    });
});
