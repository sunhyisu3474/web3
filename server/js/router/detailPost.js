const server = require('./server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const url = require('url');
function getDetailPost() {
  server.server.get('/detailPost', function (request, response) {
    return response.render('detailPost', {});
  });
}

module.exports = {
  getDetailPost
}
