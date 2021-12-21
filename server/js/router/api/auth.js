const server = require('/Users/Administrator/Documents/source/GitHub/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/GitHub/web/server/js/DB/database');
const bcrypt = require('bcrypt');
const url = require('url');

function getSignIn() {
  server.server.get('/auth/signin', (request, response) => {
    return response.render('auth/signin', {});
  });
}

function getSignUp() {
  server.server.get('/auth/signup', (request, response) => {
    return response.render('auth/signup', {});
  });
}

function postSignIn() {
  server.server.post('/auth/signin', function(request, response) {
    database.db.query(database.LOGIN_SQL + database.READ_POST + database.SELECT_SESSIONS, [request.body.login_id], function(error, results) {
      if(error) {
        console.log(error);
      } else if(!request.body.login_id || !request.body.login_pw) {
        return response.send(`<script>
          alert("필수항목을 입력하세요.");
          location.href='/auth/signin';
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
              return response.redirect('/index/signin');
            } else if(!isValue) {  // 분석한 값이 다르다면?(비로그인 처리)
              return response.send(`<script>
              alert("ID 혹은 PW가 일치하지 않습니다.");
              location.href = '/auth/signin';
              </script>`);
            }
          });
        } else if(results[0][0].pw == undefined) {
          return response.send(`<script>
         alert("계정이 존재하지 않습니다.");
         location.href='/auth/signup';
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
                  location.href = '/auth/signin';
                  </script>`);
                } else if(!ER_DUP_ENTRY) {
                  request.session.save(function(error) {
                    console.log("A new account has been created.");
                    return response.send(`<script>
                    alert("계정이 생성되었습니다.\\n로그인 페이지로 이동합니다.");
                    location.replace('/auth/signin');
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

function postSignOut() {
  server.server.post('/index/signin', function(request, response) {
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

function getFindId() {
  server.server.get('/find/id', (request, response) => {
    return response.render('auth/findID', {});
  });
}


module.exports = {
  getSignIn,
  getSignUp,
  getFindId,
  postSignUp,
  postSignOut,
  postSignIn
};
