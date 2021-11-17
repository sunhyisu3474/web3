const server = require('./server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const url = require('url');

function getIndex () {
  server.server.get('/', function (request, response) {
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";` + database.SELECT_SESSIONS, function (error, results) {
      if (error) {
        console.log(error);
      } else {
        console.log(results[1][0].session_id);
        return response.render('index', {
          post: results[0],
          session_id: results[1][0].session_id
        });
      }
    });
  });
}

function getPost () {
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

function getLogout () {  // 어떻게 구현하는지? 확인작업 필요
  server.server.get('/', function (request, response) {
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";` + database.SELECT_SESSIONS, function (error, results) {
      if (error) {
        console.log("로그아웃 중 에러가 발생하였습니다.");
        return response.render('index');
      } else {
        console.log("세션에서 로그아웃 되었습니다.");
        request.session.destroy(function () {
          request.session;
        });
        return response.render('index', {
          post: results[0],
          session_id: results[1][0].session_id
        });
      }
    });
  });
}


module.exports = {
  getIndex,
  getPost,
  getLogout
};
