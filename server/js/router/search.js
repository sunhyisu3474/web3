const server = require('./server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const url = require('url');

function getSearch() {
  server.server.get('/search', function (request, response) {
    return response.render('search', {});
  });
}

function getData() {
  server.server.get('/detailPost', function (request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.READ_POST_2, [data.dataTitle], function (error, post) {
      if (error) {
        console.log(error);
      } else {
        console.log(post);
        return response.render('detailPost', {
          post
        });
      }
    });
  });
}

module.exports = {
  getData,
  getSearch
}
