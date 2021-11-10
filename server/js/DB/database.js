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
	key: 'sunhyisu',  // 세션의 키 값
	secret: '#Sunhyisu344774',  // 암호화 키 값
	store: sessionStore,
	resave: false,  // 세션을 항상 저장?
	saveUninitialized: true,
	cookie: {
		maxAge: 900000  // 15분
	}
}));

const mysql = require('mysql');
const db = mysql.createConnection({
	host: 'localhost',
	database: 'web',
	user: 'root',
	password: '#Sunhyisu344774',
	port: '3474',
	// multipleStatements: true  // 다중쿼리 허용 설정
});

///////////////  /*  QUERY  */  ///////////////
const LOGIN_SQL = `SELECT id, pw FROM accounts WHERE id = ?`;
const REGISTER_SQL = `INSERT INTO accounts (id, pw) VALUES(?, ?)`;
const POST_CONTENTS = `INSERT INTO post (title, content) VALUES(?, ?)`;
const READ_POST = `SELECT * FROM post WHERE title = ?`;
///////////////  /*  QUERY  */  ///////////////

module.exports = {
	db,
	LOGIN_SQL,
	REGISTER_SQL,
	POST_CONTENTS,
	READ_POST,
	sessionDB,
	session
};
