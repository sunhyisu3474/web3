const server = require('/Users/Administrator/Documents/source/GitHub/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/GitHub/web/server/js/DB/database');
const bcrypt = require('bcrypt');
const url = require('url');

function getCommunity() {
  server.server.get('/community', function(request, response) {
    if(request.session.isLogin) {
      console.log(url.parse(request.url, true).query);
      return response.render('community/main', {
        name: request.session.name
      });
    } else if(!request.session.isLogin) {
      request.session.resetMaxAge();
      return response.send(`<script>
      alert("로그인 후 이용 가능합니다.");
      location.href='/auth/signin';
      </script>`);
    }
  });
}

function getDetailPost() {
  server.server.get('/community/detailpost', function(request, response) {
    request.session.resetMaxAge();
    var queryData = url.parse(request.url, true).query.idx;
    database.db.query(`SELECT * FROM post WHERE idx = ?`, [queryData], (error, result) => {
      return response.render('community/detailpost', {
        name: request.session.name,
        title: result[0].title,
        content: result[0].content,
        writer: result[0].writer,
        suggestion: result[0].suggestion,
        idx: result[0].idx
      });
    });
  });
}

function getChat() {
  server.server.get('/chat', (request, response) => {
    return response.render('chat', {
      name: request.session.name
    });
  });
}

function getBoardUpload() {
  server.server.get('/community/upload', (request, response) => {
    if(request.session.name) {
      return response.render('community/upload', {
        name: "작성자: " + request.session.name
      });
    } else if(!request.session.name) {
      return response.render('community/upload', {
        name: "로그인이 필요합니다."
      })
    }
  });
}

function getPost() {
  server.server.get('/board', function(request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.SEARCH_POST, [data.search_bar], function(error, result) {
      if(error) {
        return console.log(error);
      } else {
        request.session.resetMaxAge();
        return response.render('board', {
          post: result
        });
      }
    });
  });
}

function postUpload() {
  server.server.post('/community/upload', (request, response) => {
    if(!request.body.postTitle || !request.body.postContent) {
      return response.send(`<script>
      alert("필수 항목을 입력하세요.");
      location.href = 'community/upload';
      </script>`);
    } else {
      database.db.query(database.POST_CONTENTS, [request.body.postTitle, request.body.postContent, request.session.name], (error) => {
        if(error) {
          if(request.session.name == null) {  // 로그인 후 세션 15분이 만료되었을 경우
            console.log("세션이 만료된 계정이 게시물 작성을 시도하였습니다.");
            return response.send(`<script>
          alert("세션이 만료되었습니다. 다시 로그인 후 시도해주세요.");
          location.href = '/auth/signin';
          </script>`);
          } else {  // 모든 에러 발생 시
            console.log("An error occurred while registering the post in the DB.");
            console.log(error);
            return response.send(`<script>
            alert("게시물 등록 중 에러가 발생하였습니다.");
            location.href = 'community/upload';
            </script>`);
          }
        } else {  // 정상적인 경우
          request.session.resetMaxAge();
          console.log("A new post has been registered.");
          return response.send(`<script>
          alert("게시물이 등록되었습니다.");
          location.replace('/');
          </script>`);
        }
      });
    }
  });
}

function searchContents() {  // 게시물 통합 검색 조회 서비스 및 라우팅
  server.server.get('/community/board', (request, response) => {
    var queryData = url.parse(request.url, true).query.searchWords;
    var pathname = url.parse(request.url).pathname;
    if(request.session.name) {
      database.db.query(database.SEARCH_POST + database.SEARCH_POST_ALL, ['%' + queryData + '%', '%' + queryData + '%', '%' + queryData + '%'], (error, results) => {
        if(error) {
          console.log(error);
        } else if(results[0] && queryData !== undefined) {
          return response.render('community/board', {
            results: results[0],
            name: request.session.name
          });
        } else {
          return response.render('community/board', {
            results: results[1],
            name: request.session.name
          });
        }
      });
    } else if(!request.session.name) {
      return response.send(`<script>
        alert("로그인이 필요한 서비스입니다.");
        location.href='/auth/signin';
      </script>`)
    }
  });
}

function postRecommand() {
  server.server.post('/community/detailpost', (request, response) => {
    var queryData = url.parse(request.url, true).query.idx;
    database.db.query(`UPDATE post SET recommand = recommand+1 WHERE idx = ${ queryData }`, (error) => {
      if(error) {
        console.log(error);
      } else {
        return response.send(`<script>
        history.back();
        </script>`);
      }
    });
  });
}

module.exports = {
  getPost,
  getCommunity,
  getDetailPost,
  getChat,
  getBoardUpload,
  getDetailPost,
  postUpload,
  searchContents,
  postRecommand
};
