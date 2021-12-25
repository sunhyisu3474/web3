const server = require('./js/router/server');
const index = require('./js/router/api/index');
const auth = require('./js/router/api/auth');
const community = require('./js/router/api/community');


server.startServer();

index.getIndex();

auth.getSignIn();
auth.getSignUp();
auth.getFindId();
auth.postSignIn();
auth.postSignOut();
auth.postSignUp();

community.getPost();
community.getCommunity();
community.getDetailPost();
community.getChat();
community.getBoardUpload();
community.postUpload();
community.getDetailPost();
community.searchContents();
community.postRecommand();
