const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const url = require('url');

function getIndex() {
  server.server.get('/', function (request, response) {
    database.db.query(`SELECT title, content, writer FROM post WHERE writer = "관리자"`, function (error, post) {
      if (error) {
        console.log(error);
      } else {
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

function getSearch() {
  server.server.get('/search', function (request, response) {
    return response.render('search', {});
  });
}

function getPost() {
  server.server.get('/search', function (request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.READ_POST, [data.search_bar], function (error, post, qwe) {
      if (error) {
        return console.log(error);
      } else {
        console.log(post[data.search_bar].title);  // 어떻게 하면 클라이언트 측에 데이터가 보여지는지 방법 확인하기.
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
  getSearch,
  getPost
}
