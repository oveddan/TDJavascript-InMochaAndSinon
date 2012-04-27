var chatRoom = require('./../chapp/chat_room'),
    assert = require('chai').assert;

suite('chatRoom.addMessage', function(){
   setup(function(){
      this.room = Object.create(chatRoom);
   });
   test('should require username', function(done){
       this.room.addMessage(null, 'a message', function(err){
           assert.isNotNull(err);
           assert.instanceOf(err, TypeError);
           done();
       });
    });
    test('should require message', function(done){
        this.room.addMessage('dan', null, function(err){
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
          assert.equal(txt, msg.message);
          assert.equal('cjno', msg.user);
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
});

suite('chatRoom.getMessagesSince', function(){
    setup(function(done){
        this.room = Object.create(chatRoom),
        this.user = 'cjno',
        this.msg1 = 'msg',
        this.msg2 = 'msg2',
        this.msg3 = 'msg3';
        var self = this;

        this.room.addMessage(this.user, this.msg1, function(e, data1){
            self.data1 = data1;
            this.room.addMessage(this.user, this.msg2, function(e, data2){
                self.data2 = data2;
                this.room.addMessage(this.user, this.msg3, function(e, data3){
                    self.data3 = data3;
                    done();
                })
            }.bind(this));
        }.bind(this));
    })
    test('should get message since given id', function(done){
       var room = Object.create(chatRoom),
           user = 'cjno';
        this.room.getMessagesSince(this.data1.id, function(e, msgs){
           assert.isArray(msgs);
           assert.deepEqual(msgs, [this.data2, this.data3]);
           done();
        }.bind(this));
    });
    test('should yield an empty array if messages array does not exist', function(done){
        done();
    });
    test('should yield an empty array if no relevant messages exist', function(done){
        done();
    });
    test('should not throw exceptions if no callback provided', function(done){
        done();
    });
    test('should yield an empty array if messages array does not exist', function(done){
        done();
    });
    test('should yield an empty array if no relevant messages exist', function(done){
        done();
    });
    test('should not throw exceptions if no callback provided', function(done){
        done();
    });
})