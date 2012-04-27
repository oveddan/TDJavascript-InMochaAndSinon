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