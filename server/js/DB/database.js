const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');

const session = require('express-session');
const sessionDB = {
	host: 'localhost',
	database: 'web',
	user: 'root',
	password: '#Sunhyisu344774',
	port: '3474'
};
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(sessionDB);
server.server.use(session({
	key: 'sunhyisu',  // ������ Ű ��
	secret: '#Sunhyisu344774',  // ��ȣȭ Ű ��
	store: sessionStore,
	resave: false,  // ������ �׻� ����?
	saveUninitialized: true,
	cookie: {
		maxAge: 900000  // 15��
	}
}));





const mysql = require('mysql');
const db = mysql.createConnection({
	host: 'localhost',
	database: 'web',
	user: 'root',
	password: '#Sunhyisu344774',
	port: '3474',
	multipleStatements: true  // �������� ��� ����
});

///////////////  /*  QUERY  */  ///////////////
let LOGIN_SQL = `SELECT id, pw FROM accounts WHERE id = ?`;
let REGISTER_SQL = `INSERT INTO accounts (id, pw) VALUES(?, ?)`;
let POST_CONTENTS = `INSERT INTO post (title, content) VALUES(?, ?)`;
///////////////  /*  QUERY  */  ///////////////

module.exports = {
	db,
	LOGIN_SQL,
	REGISTER_SQL,
	POST_CONTENTS,
	sessionDB,
	session
};
