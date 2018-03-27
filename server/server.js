require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./db/database');
const { respondWithData, respondWithError } = require('./utils/sqlhandlers');
const logger = require('./middleware/logger');

const USER = 'root',
	PASSWORD = process.env.PASSWORD,
	HOST = 'localhost',
	PORT = '3306',
	DB = process.env.DB;

const app = express();
const db = new Database({
	user: USER,
	password: PASSWORD,
	host: HOST,
	database: DB
});
db.connect()
	.then(response => console.log(response));

// Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);
app.use(express.static(__dirname + '/../public'));

app.get('/issues', (req, res) => {
	const sql = 'SELECT * FROM issues';
	db.query(sql)
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/issues/:id', (req, res) => {
	const sql = 'SELECT * FROM issues WHERE id = ?';
	db.query(sql, [req.params.id])
		.then(respondWithData(res))
		.then(respondWithError(res));
});

app.get('/users', (req, res) => {
	const sql = 'SELECT * FROM users';
	db.query(sql)
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/users/:id', (req, res) => {
	const sql = 'SELECT * FROM users WHERE id = ?';
	db.query(sql, [req.params.id])
		.then(respondWithData(res))
		.then(respondWithError(res));
});

app.get('/users/:userId/issues', (req, res) => {
	const sql = `
		SELECT issues.*
		FROM users INNER JOIN user_issues ON users.id = user_issues.user_id
		INNER JOIN issues ON user_issues.issue_id = issues.id
		WHERE users.id = ?
	`;
	db.query(sql, [req.params.userId])
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});
