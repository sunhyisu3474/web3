const express = require('express');
const server = express();
const port = 80;
const bodyParser = require('body-parser');
const time = require('/Users/Administrator/Documents/source/github/web/server/js/time');
var http = require('http').createServer(server);
const io = require('socket.io')(http);

server.set('views', 'C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views');
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: false}));  // POST 방식 셋팅
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web'));
server.use(express.static('C:\/Users\/Administrator\/Documents\/source\/github\/web\/client\/views'));



module.exports = {
  server,
  express,
  port,
  http,
  io
}
