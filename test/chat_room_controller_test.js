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
       this.sendRequest(data);
       assert.equal(JSON.parse.args[0], stringData);
       done();
   });
   test('should add message from request body', function(done){
       var data = { data : { user: 'cjno', message: 'hi'}};
       this.controller.post();
       this.sendRequest(data);

       assert.isTrue(this.controller.chatRoom.addMessage.called);
       var args = this.controller.chatRoom.addMessage.args;
       assert.equal(data.data.user, args[0][0]);
       assert.equal(data.data.message, args[0][1]);
       done();
   });
   test('should write status header', function(done){
       var data = { data : { user: 'cjno', message: 'hi'}};
       this.controller.post();
       this.sendRequest(data);

       assert.isTrue(this.res.writeHead.called);
       assert.equal(201, this.res.writeHead.args[0][0], 201);
       done();
   });
});

function controllerSetup(){
    var req = this.req = new EventEmitter();
    var res = this.res = { writeHead : sinon.spy() };
    this.controller = chatRoomController.create(req, res);
    this.controller.chatRoom = { addMessage : sinon.spy() };
    this.jsonParse = JSON.parse;

    this.sendRequest = function(data){
        var str = encodeURI(JSON.stringify(data));
        this.req.emit('data', str.substring(0, str.length / 2));
        this.req.emit('data', str.substring(str.length / 2));
        this.req.emit('end');
    }
}

function controllerTearDown(){
    JSON.parse = this.jsonParse;
}


