const server = require('./js/router/server');
const router = require('./js/api');
const database = require('./js/DB/database')

require('colors');

// server.startServer();
router.startServer();


router.getIndexSignIn();
router.getIndexSignOut();
router.getSignIn();
router.getSignUp();
router.getPost();
router.getCommunity();
router.getSearch();
router.getDetailPost();
router.getTest();
router.getChat();


router.postSignIn();
router.postSignOut();
router.postSignUp();
router.postUpload();
router.postDetailPost();
