// @ts-nocheck
// const server = require('/Users/Administrator/Documents/source/github/web/server/js/router/server');
const server = require('/Users/Administrator/Documents/source/GitHub/web/server/js/router/server');

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
		maxAge: 900000,  // 15분
		path: '/'
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


const LOGIN_SQL = `SELECT * FROM accounts WHERE id = ?;`;
const REGISTER_SQL = `INSERT INTO accounts (id, pw) VALUES(?, ?);`;
const POST_CONTENTS = `INSERT INTO post (title, content, writer) VALUES(?, ?, ?);`;
const READ_POST = `SELECT * FROM post;`;
const SEARCH_POST = `SELECT * FROM post WHERE title LIKE ? OR content LIKE ? OR writer LIKE ?;`;
const SEARCH_POST_ALL = `SELECT * FROM post;`;
const SELECT_SESSIONS = `SELECT * FROM sessions;`;


module.exports = {
	db,
	LOGIN_SQL,
	REGISTER_SQL,
	POST_CONTENTS,
	READ_POST,
	SEARCH_POST,
	SEARCH_POST_ALL,
	SELECT_SESSIONS,
	sessionDB,
	session
};
