const express = require('express');
const server = express();
const port = 80;
const bodyParser = require('body-parser');
const time = require('/Users/Administrator/Documents/source/github/web/server/js/time');
const io = require('socket.io')(8080);

server.set('views', 'C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views');
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: false}));  // POST 방식 셋팅
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web'));
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views'));

function startServer () {
  server.listen(port, function (error) {
    if (error) {
      console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + "에러가 발생");
      console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + error);
    } else {
      console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + "서버가 " + port + "번 포트로" + " 정상적으로 개방");
    }
  });
}

function socketIO () {
  io.on('connnection', function (socket) {
    socket.send(socket.id, "hello");
    socket.emit('msg', `${ socket.id } 연결되었습니다.`);
    socket.on('msg', function (data) {
      console.log(socket.id, data);
      socket.emit('msg', `server:${ data } 받았습니다.`);
    });
  });
}

module.exports = {
  server, express, startServer, socketIO
}
