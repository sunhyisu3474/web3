const server = require('./js/router/server');
const router = require('./js/api');

router.startServer();


router.getIndexSignIn();
router.getIndexSignOut();
router.getSignIn();
router.getSignUp();
router.getPost();
router.getCommunity();
router.getDetailPost();
router.getTest();
router.getChat();
router.getBoardUpload();


router.postSignIn();
router.postSignOut();
router.postSignUp();
router.postUpload();
router.getDetailPost();
// router.postDetailPost();
router.searchContents();
