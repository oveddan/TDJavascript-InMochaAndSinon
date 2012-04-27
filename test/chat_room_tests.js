var chatRoom = require('./../chapp/chat_room'),
    assert = require('chai').assert;

suite('chatRoom.addMessage', function(){
   setup(function(){
      this.room = Object.create(chatRoom);
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
       this.room.addMessage('cjno', txt, function(err, msg){
          assert.isObject(msg);
          assert.isNumber(msg.id);
          assert.equal(msg.message ,txt);
          assert.equal(msg.user, 'cjno');
          done();
       });
    });
    test('should assign unique ids to messages', function(done){
       var user = 'cjno';
       this.room.addMessage(user, 'a', function(err, msg1){
           this.room.addMessage(user, 'b', function(err, msg2){
               assert.notEqual(msg1.id, msg2.id);
               done();
           });
       }.bind(this));
    });
    test('should be asynchronous', function(done){
        var id;

        this.room.addMessage('cjno', 'Hey', function(err, msg){
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
    });
    test('should get message since given id', function(done){
        var self = this;
        self.room.addMessage(self.user, 'msg', function(e, first){
            self.room.addMessage(self.user, 'msg2', function(e, second){
                self.room.getMessagesSince(first.id, function(e, msgs){
                   assert.isArray(msgs);
                   assert.deepEqual(msgs, [second]);
                   done();
               });
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
        self.room.addMessage(self.user, 'msg', function(e, first){
            self.room.addMessage(self.user, 'msg2', function(e, second){
                self.room.getMessagesSince(second.id, function(e, msgs){
                    assert.isArray(msgs);
                    assert.length(msgs, 0);
                    done();
                }) ;
            });
        });
    });
    test('should not throw exceptions if no callback provided', function(done){
        var self = this;
        self.room.addMessage(self.user, 'msg2', function(e, second){
            assert.doesNotThrow(function(){
                self.room.getMessagesSince(second.id);
                done();
            });
        });
    });
})