const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');

describe('GET /issues', () => {
	it('should return all 10 issues', (done) => {
		request(app)
			.get('/issues')
			.expect(200)
			.expect(res => {
				expect(res.body.rows.length).toBe(10);
				expect(res.body.rows[0]).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
			})
			.end(done);
	});
});

describe('GET /issues/:id', () => {
	it('should return an issue', (done) => {
		request(app)
			.get('/issues/3')
			.expect(200)
			.expect(res => {
				const issue = res.body.rows[0];
				expect(issue).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
				expect(issue.id).toBeA('number');
			})
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.get('/issues/abc')
			.expect(404)
			.end(done);
	});

	it('should return 404 if id not found', (done) => {
		request(app)
			.get('/issues/9999')
			.expect(404)
			.end(done);
	});
});

describe('GET /users', () => {
	it('should return all 8 users', (done) => {
		request(app)
			.get('/users')
			.expect(200)
			.expect(res => {
				expect(res.body.rows.length).toBe(8);
				expect(res.body.rows[0]).toIncludeKeys(['id', 'name', 'email', 'password']);
			})
			.end(done);
	});
});

describe('GET /users/:id', () => {
	it('should return a user', (done) => {
		request(app)
			.get('/users/5')
			.expect(200)
			.expect(res => {
				const user = res.body.rows[0];
				expect(user).toIncludeKeys(['id', 'name', 'email', 'password']);
				expect(user.id).toBeA('number');
			})
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.get('/users/abc')
			.expect(404)
			.end(done);
	});

	it('should return 404 if id not found', (done) => {
		request(app)
			.get('/users/9999')
			.expect(404)
			.end(done);
	});
});

describe('GET /users/:userId/issues', () => {
	it('should return all of a user\'s issues', (done) => {
		request(app)
			.get('/users/3/issues')
			.expect(200)
			.expect(res => {
				const issueIds = res.body.rows.map(issue => issue.id);
				expect(res.body.rows.length).toBe(3);
				expect(issueIds).toEqual([2, 3, 7]);
			})
			.end(done);
	});

	it('should return 404 if userId invalid', (done) => {
		request(app)
			.get('/users/abc/issues')
			.expect(404)
			.end(done);
	});

	it('should return 404 if userId not found', (done) => {
		request(app)
			.get('/users/9999/issues')
			.expect(404)
			.end(done);
	});
});