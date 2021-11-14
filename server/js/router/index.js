const server = require('./server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const url = require('url');

function getIndex() {
  server.server.get('/', function (request, response) {
    database.db.query(`SELECT* FROM post WHERE writer = "관리자"`, function (error, post) {
      if (error) {
        console.log(error);
      } else {
        console.log(request.session.name);
        return response.render('index', {
          post: post,
          request_session_name: request.session.name,
          request_session: request.session
        });
      }
    });
  });
}

function sign_out_btn_click() {
  if (database.session.name) {
    database.session.destory(function (error) {
      if (error) {
        console.log(error);
      } else {
        location.href = '/';
      }
    });
  }
}

function getPost() {
  server.server.get('/search', function (request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.READ_POST, [data.search_bar, data.search_bar], function (error, post) {
      if (error) {
        return console.log(error);
      } else {
        console.log(post);
        return response.render('search', {
          post
        });
      }
    });
  });
}


module.exports = {
  getIndex,
  sign_out_btn_click,
  getPost
}
