const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const bcrypt = require('bcrypt');
function getLogin() {
  server.server.get('/login', function (request, response) {
    return response.render('login', {});
  });
}

function postLogin() {
  server.server.post('/login', function (request, response) {
    database.db.query(database.LOGIN_SQL, [request.body.login_id], function (error, accounts) {
      var data_pw = accounts[0].pw;
      if (error) {
        console.log(error);
      } else {
        console.log(accounts[0]);
        bcrypt.compare(request.body.login_pw, data_pw, function (error, isValue) {
          if (isValue) {
            console.log("[SIGN IN] ".blue + " 로그인 되었습니다.");
            request.session.name = request.body.login_id;
            return response.send(`<script>
            alert("로그인에 성공하였습니다.");
            location.href = '/';
            </script>`);
          } else if (!isValue) {
            console.log("[SIGN IN]  계정 정보가 일치하지 않습니다.");
            return response.send(`<script>
            alert("일치하는 계정 정보가 존재하지 않습니다.");
            location.href = '/login';
            </script>`);
          }
          database.db.destroy();  // 로그인 완료 된 경우 DB 연결을 종료한다.
        });
      }
    });
  });
}


module.exports = {
  getLogin, postLogin
}
