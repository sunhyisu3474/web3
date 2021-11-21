const server = require('./router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const bcrypt = require('bcrypt');
const url = require('url');


function getIndexSignIn () {
  var time = new Date();
  server.server.get('/index_signin' || '/', function (request, response) {
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";` + database.SELECT_SESSIONS, function (error, results) {
      if (error) {
        console.log(error);
      } else {
        if (request.session.isLogin) {
          response.render('index_signin', {
            post: results[0]
          });
          request.session.resetMaxAge();
        } else if (request.session.isLogin == undefined || results[1].expires > time.getTime() + 10_000) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
          request.session.destroy(function (error) {
            if (error) {
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

function getIndexSignOut () {
  server.server.get('/', function (request, response) {
    database.db.query(`SELECT * FROM post WHERE writer = "관리자";`, function (error, results) {
      if (error) {
        console.log(error);
      } else {
        if (request.session.isLogin == undefined) {
          response.render('index_signout', {
            post: results
          });
        } else if (request.session.isLogin) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
          response.redirect('/index_signin');
        }
      }
    });
  });
}


function getPost () {
  server.server.get('/search', function (request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.SEARCH_POST, [data.search_bar], function (error, result) {
      if (error) {
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

function getLogout () {
  server.server.post('/index_signin', function (request, response) {
    request.session.destroy(function (error) {
      if (error) {
        console.log(error);
        console.log("세션 삭제 중 에러 발생");
      } else {
        return response.clearCookie('sunhyisu').redirect('/');
      }
    });
  });
}


function getLogin () {
  server.server.get('/login', function (request, response) {
    return response.render('login', {});
  });
}


function postLogin () {
  server.server.post('/login', function (request, response) {
    database.db.query(database.LOGIN_SQL + database.READ_POST + database.SELECT_SESSIONS, [request.body.login_id], function (error, results) {
      var data_pw = results[0][0].pw;
      if (error) {
        console.log(error);
      } else {
        bcrypt.compare(request.body.login_pw, data_pw, function (error, isValue) {
          if (error) {
            console.log(error);
          }
          else if (isValue) {
            console.log("[SIGN IN] 로그인, sessionID : " + request.session.id);
            request.session.isLogin = true;
            // console.log(results[2][0].expires);
            return response.redirect('/index_signin');
          } else if (!isValue) {
            console.log("[SIGN IN]  계정 정보가 일치하지 않습니다.");
            return response.send(`<script>
              alert("일치하는 계정이 없습니다.");
              location.href='/login';
              </script>`);
          }
        });
      }
    });
  });
}

function getRegister () {
  server.server.get('/register', function (request, response) {
    return response.render('register', {
      name: "관리자"
    });
  });
}



function postRegister () {
  server.server.post('/register', function (request, response) {
    if (request.body.registerPW !== "" && request.body.registerID.length >= 12 && request.body.registerPW_confirm === request.body.registerPW) {  // 계정 회원가입 유효성 검증
      bcrypt.genSalt(15, function (error, salt) {
        if (error) {
          console.log("[SIGN-UP] salt 생성 중 에러 발생");
        } else {
          bcrypt.hash(request.body.registerPW, salt, function (error, hash) {
            if (error) {
              console.log("[SIGN-UP] hash 변환 중 에러 발생");
            } else {
              request.body.registerPW = hash;
              database.db.query(database.REGISTER_SQL, [request.body.registerID, request.body.registerPW], function (ER_DUP_ENTRY, error) {
                if (ER_DUP_ENTRY) {
                  console.log("[SIGN-UP] 중복된 계정입니다.\n" + ER_DUP_ENTRY);
                  return response.send(`<script>
                  alert("이미 존재하는 ID입니다.\\n로그인 페이지로 이동합니다.");
                  location.href = '/login';
                  </script>`);
                } else if (!ER_DUP_ENTRY) {
                  request.session.save(function (error) {
                    console.log("[SIGN-UP] 새로운 계정이 생성되었습니다.");
                    return response.send(`<script>
        alert("계정이 생성되었습니다.\\n로그인 페이지로 이동합니다.");
        location.replace('login');
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
    } else if (request.body.registerPW_confirm !== request.body.registerPW) {
      return response.send(`<script>
    alert("입력하신 암호와 재확인 암호가 불일치합니다.\\n암호를 다시 한 번 확인해주세요.");
    history.back();
    </script>`);
    } else if (request.body.registerID.length < 12) {
      console.log("ID값이 12자 미만입니다.");
      return response.send(`<script>
    alert("ID 값은 최소 12자 이상으로 입력하세요.");
    history.back();
    </script>`);
    } else if (request.body.registerPW === "" || " ") {
      console.log("암호 규칙에 어긋납니다.");
      return response.send(`<script>
    alert("암호에 공백을 입력하셨습니다.\\n암호 규칙에 맞게 가입을 진행해주세요.");
    history.back();
    </script>`);
    }
  });
}

function getSearch () {
  server.server.get('/search', function (request, response) {
    request.session.resetMaxAge();
    return response.render('search', {});
  });
}

function getData () {
  server.server.get('/detailPost', function (request, response) {
    var data = url.parse(request.url, true).query;
    database.db.query(database.SEARCH_POST, [data.dataTitle], function (error, result) {
      if (error) {
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

function getUpload () {
  server.server.get('/upload', function (request, response) {
    if (request.session.isLogin) {
      return response.render('upload', {});
    } else {
      request.session.resetMaxAge();
      return response.send(`<script>
      alert("로그인 후 이용 가능합니다.");
      location.replace('/');
      </script>`);
    }
  });
}

function postUpload () {
  server.server.post('/upload', function (request, response) {
    if (!request.body.title || !request.body.content) {
      console.log("제목 혹은 내용이 누락되었습니다.");
      return response.send(`<script>
      alert("제목 혹은 내용이 누락되었습니다.");
      location.href = '/upload';
      </script>`);
    } else {
      database.db.query(database.POST_CONTENTS, [request.body.title, request.body.content], function (error) {
        if (error) {
          console.log("데이터 처리 중 에러가 발생하였습니다.");
          return response.send(`<script>
      alert("데이터 처리 중 에러가 발생하였습니다.");
      location.href = '/upload';
      </script>`);
        } else {
          request.session.resetMaxAge();
          console.log("요청하신 데이터가 정상적으로 처리되었습니다.");
          return response.send(`<script>
      alert("요청하신 데이터가 정상적으로 처리되었습니다");
      location.replace('/');
      </script>`);
        }
      });
    }
  });
}

function getDetailPost () {
  server.server.get('/detailPost', function (request, response) {
    request.session.resetMaxAge();
    return response.render('detailPost', {});
  });
}

function getTest () {
  server.server.get('/test', function (request, response) {
    return response.render('test');
  });
}

module.exports = {
  getIndexSignIn,
  getIndexSignOut,
  getPost,
  getLogout,
  postLogin,
  getLogin,
  postRegister,
  getRegister,
  getSearch,
  getData,
  postUpload,
  getUpload,
  getDetailPost,
  getTest
};
