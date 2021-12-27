const server = require('/Users/Administrator/Documents/source/GitHub/web/server/js/router/server');
const database = require('/Users/Administrator/Documents/source/GitHub/web/server/js/DB/database');
const bcrypt = require('bcrypt');
const url = require('url');

function getIntroduce() {
  server.server.get('/resume/introduce', (request, response) => {
    return response.render('resume/introduce', {});
  });
}

module.exports = {
  getIntroduce
}
