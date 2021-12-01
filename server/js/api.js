const server = require('./router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const bcrypt = require('bcrypt');
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
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";` + database.SELECT_SESSIONS, function(error, results) {
      if(error) {
        console.log(error);
      } else {
        if(request.session.isLogin) {
          response.render('index_signin', {
            post: results[0]
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
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";`, function(error, results) {
      if(error) {
        console.log(error);
      } else {
        if(request.session.isLogin == undefined) {
          response.render('index_signout', {
            post: results
          });
        } else if(request.session.isLogin) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
          response.redirect('/index_signin');
        }
      }
    });
  });
}

function getDetailPost() {
  server.server.get('/detailPost', function(request, response) {
    request.session.resetMaxAge();
    return response.render('detailPost', {});
  });
}

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
    } /* else if(url.parse(request.url, true).query == "board") {
      console.log("성공");
      return response.render('board', {});
    } */
  });
}

function getSignUp() {
  server.server.get('/signup', function(request, response) {
    return response.render('signup', {
      name: "관리자"
    });
  });
}

function getSearch() {
  server.server.get('/search', function(request, response) {
    request.session.resetMaxAge();
    return response.render('search', {});
  });
}

function getBoard() {
  server.server.get('/board', (request, response) => {
    return response.render('board', {});
  });
}

function postSignIn() {
  server.server.post('/signin', function(request, response) {
    database.db.query(database.LOGIN_SQL + database.READ_POST + database.SELECT_SESSIONS, [request.body.login_id], function(error, results) {
      var data_pw = results[0][0].pw;
      if(error) {
        console.log(error);
      } else {
        bcrypt.compare(request.body.login_pw, data_pw, function(error, isValue) {
          if(error) {
            console.log(error);
          }
          else if(isValue) {
            request.session.isLogin = true;
            request.session.name = request.body.login_id;
            console.log(results[0][0].id);
            return response.redirect('/index_signin');
          } else if(!isValue) {
            return response.send(`< script >
  alert("일치하는 계정이 없습니다.");
  location.href = '/login';
              </script > `);
          }
        });
      }
    });
  });
}

function postSignUp() {
  server.server.post('/register', function(request, response) {
    if(request.body.registerPW !== "" && request.body.registerID.length >= 12 && request.body.registerPW_confirm === request.body.registerPW) {  // 계정 회원가입 유효성 검증
      bcrypt.genSalt(15, function(error, salt) {
        if(error) {
          console.log("An error occurred during account encryption.");
        } else {
          bcrypt.hash(request.body.registerPW, salt, function(error, hash) {
            if(error) {
              console.log("An error occurred during account encryption.");
            } else {
              request.body.registerPW = hash;
              database.db.query(database.REGISTER_SQL, [request.body.registerID, request.body.registerPW], function(ER_DUP_ENTRY, error) {
                if(ER_DUP_ENTRY) {
                  console.log("Duplicate account.");
                  return response.send(`< script >
    alert("이미 존재하는 ID입니다.\\n로그인 페이지로 이동합니다.");
  location.href = '/login';
                  </script > `);
                } else if(!ER_DUP_ENTRY) {
                  request.session.save(function(error) {
                    console.log("A new account has been created.");
                    return response.send(`< script >
    alert("계정이 생성되었습니다.\\n로그인 페이지로 이동합니다.");
  location.replace('login');
        </script > `);
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
      return response.send(`< script >
    alert("입력하신 암호와 재확인 암호가 불일치합니다.\\n암호를 다시 한 번 확인해주세요.");
  history.back();
    </script > `);
    } else if(request.body.registerID.length < 12) {
      return response.send(`< script >
    alert("ID 값은 최소 12자 이상으로 입력하세요.");
  history.back();
    </script > `);
    } else if(request.body.registerPW === "" || " ") {
      return response.send(`< script >
    alert("암호에 공백을 입력하셨습니다.\\n암호 규칙에 맞게 가입을 진행해주세요.");
  history.back();
    </script > `);
    }
  });
}

function postDetailPost() {
  server.server.get('/detailPost', function(request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.SEARCH_POST, [data.dataTitle], function(error, result) {
      if(error) {
        console.log(error);
      } else {
        request.session.resetMaxAge();
        return response.render('detailPost', {
          post: result
        });
      }
    });
  });
}

function postUpload() {
  server.server.post('/community', function(request, response) {
    if(!request.body.title || !request.body.content) {
      return response.send(`< script >
    location.href = '/community';
      </script > `);
    } else {
      database.db.query(database.POST_CONTENTS, [request.body.title, request.body.content], function(error) {
        if(error) {
          console.log("An error occurred while registering the post in the DB.");
          return response.send(`< script >
    alert("게시물 등록 중 에러가 발생하였습니다.");
  location.href = '/community';
      </script > `);
        } else {
          request.session.resetMaxAge();
          console.log("A new post has been registered.");
          return response.send(`< script >
    alert("게시물이 등록되었습니다.");
  location.replace('/');
      </script > `);
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
  getSearch,
  getBoard,
  postSignUp,
  postDetailPost,
  postUpload,
  postSignOut,
  postSignIn
};
