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
	multipleStatements: true  // 다중쿼리 허용 설정
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
