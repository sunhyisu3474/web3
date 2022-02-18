const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/github/web/server/js/DB/database');
const bcrypt = require('bcrypt');
const url = require('url');

function getIndex() {
  var time = new Date();
  server.server.get('/', (request, response) => {
    database.db.query(`SELECT * FROM post WHERE writer >= 'sunhyisu3474';` + database.SELECT_SESSIONS, function(error, results) {
      if(error) {
        console.log(error);
      } else {
        if(request.session.isLogin) {
          return response.render('index/signin', {
            results,
            name: request.session.name
          });
          request.session.resetMaxAge();
        } else if(request.session.isLogin == undefined || results[1].expires > time.getTime() + 10_000) {  // session DB에서 갑작스런 초기화로 인한 경우, session 유효시간이 만료된 경우
          request.session.destroy(function(error) {
            if(error) {
              console.log(error);
            } else {
              response.clearCookie('sunhyisu').render('index/signout', {});
            }
          });
        }
      }
    });
  });
}

function getIndexSignOut() {
  server.server.get('/', (request, response) => {
    if(!request.session.isLogin) {
      response.render('index/signout', {});
    } else {
      response.render('index/signin', {
        name: request.session.name,
      });
    }
  });


}


module.exports = {
  getIndex
};
