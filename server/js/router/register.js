const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const bcrypt = require('bcrypt');
function getRegister() {
  server.server.get('/register', function (request, response) {
    return response.render('register', {
      name: "관리자"
    });
  });
}

function postRegister() {
  server.server.post('/register', function (request, response) {
    if (request.body.registerPW !== "" && request.body.registerID.length >= 12 && request.body.registerPW_confirm === request.body.registerPW) {  // 계정 회원가입 유효성 검증
      bcrypt.genSalt(15, function (error, salt) {
        if (error) {
          console.log("[SIGN-UP] ".red + " salt 생성 중 에러 발생");
        } else {
          bcrypt.hash(request.body.registerPW, salt, function (error, hash) {
            if (error) {
              console.log("[SIGN-UP] ".red + " hash 변환 중 에러 발생");
            } else {
              request.body.registerPW = hash;
              database.db.query(database.REGISTER_SQL, [request.body.registerID, request.body.registerPW], function (ER_DUP_ENTRY, error) {
                if (ER_DUP_ENTRY) {
                  console.log("[SIGN-UP] ".red + " 중복된 계정입니다.\n" + ER_DUP_ENTRY);
                  return response.send(`<script>
                  alert("이미 존재하는 ID입니다.\\n로그인 페이지로 이동합니다.");
                  location.href = '/login';
                  </script>`);
                } else if (!ER_DUP_ENTRY) {
                  request.session.save(function (error) {
                    console.log("[SIGN-UP] ".blue + " 새로운 계정이 생성되었습니다.");
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

module.exports = {
  getRegister, postRegister
}
