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
});