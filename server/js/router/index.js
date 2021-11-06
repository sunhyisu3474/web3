const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
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


module.exports = {
  getIndex, sign_out_btn_click
}
