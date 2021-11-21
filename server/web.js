const server = require('./js/router/server');
const router = require('./js/api');
const database = require('./js/DB/database')

require('colors');

server.startServer();
server.socketIO();

router.getIndexSignIn();
router.getIndexSignOut();
router.getPost();
router.getLogout();

router.getLogin();
router.postLogin();

router.getRegister();
router.postRegister();

router.getUpload();
router.postUpload();

router.getData();
router.getSearch();

router.getDetailPost();

router.getTest();
