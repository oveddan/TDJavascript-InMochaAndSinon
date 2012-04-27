var chatRoom = require('./../chapp/chat_room'),
    assert = require('chai').assert,
    all = require('node-promise').all,
    Promise = require('node-promise').Promise,
    sinon = require('sinon');

suite('chatRoom', function(){
    test('should be event emitter', function(){
        assert.isFunction(chatRoom.addListener);
        assert.isFunction(chatRoom.emit);
    });
});

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

        this.room.getMessagesSince(id - 1).then(function(msgs){
            assert.equal(msgs.length, 1);
            done();
        });
    });
    test('should return a promise', function(done){
        var result = this.room.addMessage('cjno', 'message');
        assert.isObject(result);
        assert.isFunction(result.then);
        done();
    });
    test("should emit 'message' event", function(done){
       var message;

        this.room.addListener('message', function(m){
            message = m;
        });

        this.room.addMessage('cjno', 'msg').then(function(m){
           assert.equal(m, message);
           done();
        });
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
    test('should return promise', function(done){
        var result = this.room.getMessagesSince(20);

        assert.isObject(result);
        assert.isFunction(result.then);
        done();
    });
    test('should get message since given id', function(done){
        var self = this;
        var add = all(self.room.addMessage(self.user, 'msg').then(self.collect),
            self.room.addMessage(self.user, 'msg2').then(self.collect));

        add.then(function(){
            self.room.getMessagesSince(self.messages[0].id).then(function(msgs){
               assert.isArray(msgs);
               assert.deepEqual(msgs, [self.messages[1]]);
               done();
           });
        });
    });
    test('should yield an empty array if messages array does not exist', function(done){
        this.room.getMessagesSince(0).then(function(msgs){
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
            self.room.getMessagesSince(self.messages[1].id).then(function(msgs){
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
});

suite('chatRoom.waitForMessagesSince', function(){
   setup(function(){
       this.room = Object.create(chatRoom);
   });
   test('should yield existing messages', function(done){
      var promise = new Promise();
       var data = [{id: 43}];
      promise.resolve(data);
       this.room.getMessagesSince = sinon.stub().returns(promise);

       this.room.waitForMessagesSince(42).then(function(m){
          assert.equal(data, m);
          done();
       });
   });
   test('should add listener when no messages', function(done){
      this.room.addListener = sinon.stub();
      var promise = new Promise();
      promise.resolve([]);
      this.room.getMessagesSince = sinon.stub().returns(promise);

       this.room.waitForMessagesSince(0);

       process.nextTick(function(){
          assert.equal(this.room.addListener.args[0][0], 'message');
          assert.isFunction(this.room.addListener.args[0][1]);
          done();
       }.bind(this));
   });
   test('new message should resolve waiting', function(done){
      var user = 'cjno',
          msg = 'Are you waiting for this?';

       this.room.waitForMessagesSince(0).then(function(msgs){
          assert.isArray(msgs);
          assert.equal(msgs.length, 1);
          assert.equal(msgs[0].user, user);
          assert.equal(msgs[0].message, msg);
           done();
       });

       process.nextTick(function(){
          this.room.addMessage(user, msg);
       }.bind(this));
   });
});