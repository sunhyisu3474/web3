const server = require('./router/server');
const database = require('./DB/database');
const bcrypt = require('bcrypt');
const striptags = require('striptags');
const url = require('url');
function startServer() {
  server.http.listen(server.port, (error) => {
    if(error) {
      console.log("Failed to open server and port");
    } else {
      console.log("[" + server.port + "]" + "server open..");
    }
  });

  var counts = 1;
  server.io.on('connection', (socket, request) => {
    console.log("connected account : " + socket.id);

    socket.on('disconnect', () => {
      console.log("disconnected account : " + socket.id);
    });

    socket.on('send message', (name, text) => {
      var msg = name + " : " + text;
      console.log(msg);
      server.io.emit('receive message', msg);
    });
  });
}

function getIndexSignIn() {
  var time = new Date();
  server.server.get('/index_signin' || '/', function(request, response) {
    database.db.query(`SELECT * FROM post WHERE suggestion >= '2';` + database.SELECT_SESSIONS, function(error, results) {
      if(error) {
        console.log(error);
      } else {
        if(request.session.isLogin) {
          return response.render('index_signin', {
            results,
            name: request.session.name
          });
          request.session.resetMaxAge();
        } else if(request.session.isLogin == undefined || results[1].expires > time.getTime() + 10_000) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
          request.session.destroy(function(error) {
            if(error) {
              console.log(error);
            } else {
              response.clearCookie('sunhyisu');
              return response.redirect('/');
            }
          });
        }
      }
    });
  });
}

function getIndexSignOut() {
  server.server.get('/', function(request, response) {
    if(request.session.isLogin == undefined) {
      response.render('index_signout', {});
    } else if(request.session.isLogin) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
      response.redirect('/index_signin');
    }
  });
}

function getDetailPost() {

  server.server.get('/board/detailpost', function(request, response) {
    request.session.resetMaxAge();
    var queryData = url.parse(request.url, true).query.idx;
    database.db.query(`SELECT * FROM post WHERE idx = ?`, [queryData], (error, result) => {
      return response.render('detailpost', {
        name: request.session.name,
        title: result[0].title,
        content: result[0].content,
        writer: result[0].writer,
        suggestion: result[0].suggestion,
        idx: result[0].idx,
        // striptagscontent: $('#summernote').summernote('code')
      });
    });
  });
  /*   server.server.get('/detailpost', (request, response) => {
      return response.redirect('/board/detailpost');
    }); */
}

/* function postDetailPost() {
  server.server.post('/detailpost || /board/detailpost', (request, response) => {
    return response.redirect('/board/detailPost');
  });
} */

function getTest() {
  server.server.get('/test', function(request, response) {
    return response.render('test', {});
  });
}

function getChat() {
  server.server.get('/chat', (request, response) => {
    return response.render('chat', {
      name: request.session.name
    });
  });
}

function getPost() {
  server.server.get('/search', function(request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.SEARCH_POST, [data.search_bar], function(error, result) {
      if(error) {
        return console.log(error);
      } else {
        request.session.resetMaxAge();
        return response.render('search', {
          post: result
        });
      }
    });
  });
}

function getSignIn() {
  server.server.get('/signin', function(request, response) {
    return response.render('signin', {});
  });
}

function getCommunity() {
  server.server.get('/community', function(request, response) {
    if(request.session.isLogin) {
      console.log(url.parse(request.url, true).query);
      return response.render('community', {});
    } else if(!request.session.isLogin) {
      request.session.resetMaxAge();
      return response.send(`<script>
      alert("로그인 후 이용 가능합니다.");
      location.href='signin';
      </script>`);
    }
  });
}

function getSignUp() {
  server.server.get('/signup', function(request, response) {
    return response.render('signup', {
      name: "관리자"
    });
  });
}

function searchContents() {  // 게시물 통합 검색 조회 서비스 및 라우팅
  server.server.get('/board', (request, response) => {
    var queryData = url.parse(request.url, true).query.searchWords;
    var pathname = url.parse(request.url).pathname;
    if(request.session.name) {
      database.db.query(database.SEARCH_POST + database.SEARCH_POST_ALL, ['%' + queryData + '%', '%' + queryData + '%', '%' + queryData + '%'], (error, results) => {
        if(error) {
          console.log(error);
        } else if(results[0] && queryData !== undefined) {
          return response.render('board', {
            results: results[0],
            name: request.session.name
          });
        } else {
          return response.render('board', {
            results: results[1],
            name: request.session.name
          });
        }
      });
    } else if(!request.session.name) {
      return response.send(`<script>
        alert("로그인이 필요한 서비스입니다.");
        location.href='/signin';
      </script>`)
    }
  });
}

function getBoardUpload() {
  server.server.get('/board/boardupload', (request, response) => {
    if(request.session.name) {
      return response.render('boardUpload', {
        name: "작성자: " + request.session.name
      });
    } else if(!request.session.name) {
      return response.render('boardUpload', {
        name: "로그인이 필요합니다."
      })
    }
  });
}

function postSignIn() {
  server.server.post('/signin', function(request, response) {
    database.db.query(database.LOGIN_SQL + database.READ_POST + database.SELECT_SESSIONS, [request.body.login_id], function(error, results) {
      if(error) {
        console.log(error);
      } else if(!request.body.login_id || !request.body.login_pw) {
        return response.send(`<script>
          alert("필수항목을 입력하세요.");
          location.href='/signin';
        </script>`);
      } else {
        if(request.body.login_id === results[0][0].id) {
          bcrypt.compare(request.body.login_pw, results[0][0].pw, function(error, isValue) {  // 입력한 값과, DB에 저장된 pw를 분석
            if(error) {
              console.log(error);
            } else if(isValue) {  // 분석한 값이 같다면?(로그인 처리)
              request.session.isLogin = true;
              request.session.name = request.body.login_id;
              console.log(results[0][0].id);
              return response.redirect('/index_signin');
            } else if(!isValue) {  // 분석한 값이 다르다면?(비로그인 처리)
              return response.send(`<script>
              alert("ID 혹은 PW가 일치하지 않습니다.");
              location.href = '/signin';
              </script>`);
            }
          });
        } else if(results[0][0].pw == undefined) {
          return response.send(`<script>
         alert("계정이 존재하지 않습니다.");
         location.href='/signup';
         </script>`);
        }
      }
    });
  });
}

function postSignUp() {
  server.server.post('/signup', (request, response) => {
    if(request.body.signupPW !== "" && request.body.signupID.length >= 12 && request.body.signupPW_confirm === request.body.signupPW) {  // 계정 회원가입 유효성 검증
      bcrypt.genSalt(15, (error, salt) => {
        if(error) {
          console.log("An error occurred during account encryption.");
        } else {
          bcrypt.hash(request.body.signupPW, salt, (error, hash) => {
            if(error) {
              console.log("An error occurred during account encryption.");
            } else {
              request.body.signupPW = hash;
              database.db.query(database.REGISTER_SQL, [request.body.signupID, request.body.signupPW], function(ER_DUP_ENTRY, error) {
                if(ER_DUP_ENTRY) {
                  console.log("Duplicate account.");
                  console.log(ER_DUP_ENTRY);
                  return response.send(`<script>
                  alert("이미 존재하는 ID입니다.\\n로그인 페이지로 이동합니다.");
                  location.href = '/signin';
                  </script>`);
                } else if(!ER_DUP_ENTRY) {
                  request.session.save(function(error) {
                    console.log("A new account has been created.");
                    return response.send(`<script>
                    alert("계정이 생성되었습니다.\\n로그인 페이지로 이동합니다.");
                    location.replace('signin');
                    </script>`);
                  });
                } else {
                  throw error;
                }
              });
            }
          });
        }
      });
    } else if(request.body.registerPW_confirm !== request.body.registerPW) {
      return response.send(`<script>
    alert("입력하신 암호와 재확인 암호가 불일치합니다.\\n암호를 다시 한 번 확인해주세요.");
  history.back();
    </script> `);
    } else if(request.body.registerID.length < 12) {
      return response.send(`<script>
    alert("ID 값은 최소 12자 이상으로 입력하세요.");
  history.back();
    </script> `);
    } else if(request.body.registerPW === "" || " ") {
      return response.send(`<script>
    alert("암호에 공백을 입력하셨습니다.\\n암호 규칙에 맞게 가입을 진행해주세요.");
  history.back();
    </script> `);
    }
  });
}

function postUpload() {
  server.server.post('/board/boardUpload', (request, response) => {
    if(!request.body.postTitle || !request.body.postContent) {
      return response.send(`<script>
      alert("필수 항목을 입력하세요.");
      location.href = '/board/boardUpload';
      </script>`);
    } else {
      database.db.query(database.POST_CONTENTS, [request.body.postTitle, request.body.postContent, request.session.name], (error) => {
        if(error) {
          if(request.session.name == null) {  // 로그인 후 세션 15분이 만료되었을 경우
            console.log("세션이 만료된 계정이 게시물 작성을 시도하였습니다.");
            return response.send(`<script>
          alert("세션이 만료되었습니다. 다시 로그인 후 시도해주세요.");
          location.href = '/signin';
          </script>`);
          } else {  // 모든 에러 발생 시
            console.log("An error occurred while registering the post in the DB.");
            console.log(error);
            return response.send(`<script>
            alert("게시물 등록 중 에러가 발생하였습니다.");
            location.href = '/boardUpload';
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

function postSignOut() {
  server.server.post('/index_signin', function(request, response) {
    request.session.destroy(function(error) {
      if(error) {
        console.log(error);
        console.log("An error occurred while deleting the session.");
      } else {
        console.log("The session was successfully deleted.");
        return response.clearCookie('sunhyisu').redirect('/');
      }
    });
  });
}

module.exports = {
  startServer,
  getIndexSignIn,
  getIndexSignOut,
  getPost,
  getSignIn,
  getCommunity,
  getDetailPost,
  getChat,
  getTest,
  getSignUp,
  getBoardUpload,
  postSignUp,
  getDetailPost,
  postUpload,
  postSignOut,
  postSignIn,
  searchContents
};
