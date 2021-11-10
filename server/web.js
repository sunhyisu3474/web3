const server = require('./js/router/server');
const index = require('./js/router/index');
const login = require('./js/router/login');
const register = require('./js/router/register');
const upload = require('./js/router/upload');
const database = require('./js/DB/database');
const time = require('./js/time');
const search = require('./js/router/search');

require('colors');

server.startServer();

index.getIndex();

index.getPost();

index.getSearch();

login.getLogin();

login.postLogin();

register.getRegister();

register.postRegister();

upload.getUpload();

upload.postUpload();
