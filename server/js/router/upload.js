const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
function getUpload() {
  server.server.get('/upload', function (request, response) {
    if (request.session.name) {
      return response.render('upload', {});
    } else {
      return response.send(`<script>alert("로그인 후 이용 가능합니다.");</script>`)
    }
  });
}

function postUpload() {
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

module.exports = {
  getUpload, postUpload
}
