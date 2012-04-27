var chatRoomController = require('./../chapp/chat_room_controller'),
    assert = require('chai').assert,
    EventEmitter = require('events').EventEmitter,
    sinon = require('sinon');

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

suite('chatRoomController.post', function(){
   setup(controllerSetup);
   teardown(controllerTearDown);
   test('should parse request body as JSON', function(done){
      var data = { data : { user: 'cjno', message: 'hi'}};
      var stringData = JSON.stringify(data);
      var str = encodeURI(stringData);
       JSON.parse = sinon.stub().returns(data);
       this.controller.post();
       this.req.emit('data', str.substring(0, str.length/2));
       this.req.emit('data', str.substring(str.length / 2));
       this.req.emit('end');
       assert.equal(JSON.parse.args[0], stringData);
       done();
   });
});

function controllerSetup(){
    var req = this.req = new EventEmitter();
    var res = this.res = {};
    this.controller = chatRoomController.create(req, res);
    this.jsonParse = JSON.parse;
}

function controllerTearDown(){
    JSON.parse = this.jsonParse;
}


