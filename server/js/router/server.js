const express = require('express');
const server = express();
const port = 1515;
const bodyParser = require('body-parser');
const time = require('/Users/Administrator/Documents/source/github/web/server/js/time');
var http = require('http').createServer(server);
const io = require('socket.io')(http);

server.set('views', 'C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views');
server.set('views', 'C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views\/html');
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: false}));  // POST 방식 셋팅
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web'));
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views'));

function startServer() {
  http.listen(port, (error) => {
    if(error) {
      console.log("Failed to open server and port");
    } else {
      console.log("[" + port + "]" + "server open..");
    }
  });

  var counts = 1;
  io.on('connection', (socket, request) => {
    console.log("connected account : " + socket.id);

    socket.on('disconnect', () => {
      console.log("disconnected account : " + socket.id);
    });

    socket.on('send message', (name, text) => {
      var msg = name + " : " + text;
      console.log(msg);
      io.emit('receive message', msg);
    });
  });
}

module.exports = {
  server,
  express,
  port,
  http,
  io,
  startServer
}
