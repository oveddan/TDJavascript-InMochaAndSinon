var chatRoom = require('./../chapp/chat_room'),
    assert = require('chai').assert,
    all = require('node-promise').all;

suite('chatRoom.addMessage', function(){
   setup(function(){
      this.room = Object.create(chatRoom),
      this.messages = [];
      var self = this;
      this.collect = function(msg) { self.messages.push(msg); }
   });
   teardown(function(){
       this.messages = null;
   });
   test('should require username', function(done){
       var promise = this.room.addMessage(null, 'a message');

       promise.then(function() {}, function(err){
           assert.isNotNull(err);
           assert.instanceOf(err, TypeError);
           done();
       });
    });
    test('should require message', function(done){
        var promise = this.room.addMessage('dan', null);

        promise.then(function() {}, function(err){
            assert.isNotNull(err);
            assert.instanceOf(err, TypeError);
            done();
        });
    });
    test('should not require a callback', function(done){
        var err = null;

        assert.doesNotThrow(function(){
           this.room.addMessage();
           done();
        }.bind(this));
    });
    test('should call callback with new object', function(done){
       var txt = 'Some message';
       this.room.addMessage('cjno', txt).then(function(msg){
          assert.isObject(msg);
          assert.isNumber(msg.id);
          assert.equal(msg.message ,txt);
          assert.equal(msg.user, 'cjno');
          done();
       });
    });
    test('should assign unique ids to messages', function(done){
        var self = this;
        var add = all(this.room.addMessage('u', 'a').then(this.collect),
                this.room.addMessage('u', 'b').then(this.collect));
        add.then(function(){
            assert.notEqual(self.messages[0].id, self.messages[1].id);
            done();
        });
    });
    test('should be asynchronous', function(done){
        var id;

        this.room.addMessage('cjno', 'Hey').then(function(msg){
            id = msg.id
        });

        this.room.getMessagesSince(id - 1, function(err, msgs){
            assert.equal(msgs.length, 0);
            done();
        });
    });
    test('should return a promise', function(done){
        var result = this.room.addMessage('cjno', 'message');
        assert.isObject(result);
        assert.isFunction(result.then);
        done();
    });
});

suite('chatRoom.getMessagesSince', function(){
    setup(function(){
        this.room = Object.create(chatRoom),
        this.user = 'cjno';
        this.messages = [];
        var self = this;
        this.collect = function(msg) { self.messages.push(msg); }
    });
    teardown(function(){
        this.messages = null;
    });
    test('should get message since given id', function(done){
        var self = this;
        var self = this;
        var add = all(self.room.addMessage(self.user, 'msg').then(self.collect),
            self.room.addMessage(self.user, 'msg2').then(self.collect));

        add.then(function(){
            self.room.getMessagesSince(self.messages[0].id, function(e, msgs){
               assert.isArray(msgs);
               assert.deepEqual(msgs, [self.messages[1]]);
               done();
           });
        });
    });
    test('should yield an empty array if messages array does not exist', function(done){
        this.room.getMessagesSince(0, function(e, msgs){
            assert.isArray(msgs);
            assert.length(msgs, 0);
            done();
        })
    });
    test('should yield an empty array if no relevant messages exist', function(done){
        var self = this;
        var add = all(self.room.addMessage(self.user, 'msg').then(self.collect),
            self.room.addMessage(self.user, 'msg2').then(self.collect));

        add.then(function(){
            self.room.getMessagesSince(self.messages[1].id, function(e, msgs){
                assert.isArray(msgs);
                assert.length(msgs, 0);
                done();
            });
        });
    });
    test('should not throw exceptions if no callback provided', function(done){
        var self = this;
        self.room.addMessage(self.user, 'msg2').then(function(second){
            assert.doesNotThrow(function(){
                self.room.getMessagesSince(second.id);
                done();
            });
        });
    });
})