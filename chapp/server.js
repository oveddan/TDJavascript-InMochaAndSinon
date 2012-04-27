var http = require('http'),
    url = require('url'),
    crController = require('../chapp/chat_room_controller'),
    chatRoom = require('../chapp/chat_room'),
    room = Object.create(chatRoom);

module.exports = http.createServer(function(req, res){
   if(url.parse(req.url).pathname == '/comet'){
       var controller = crController.create(req, res);
       controller.chatRoom = room;
       controller[req.method.toLocaleLowerCase()]();
   }
});