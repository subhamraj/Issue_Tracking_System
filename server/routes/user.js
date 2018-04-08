const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    User.findAll()
		.then(users => {
			if (users.length === 0) {
				return res.status(404).send();
			}
			users = users.map(user => user.toPublic());
			res.json({ users });
		})
		.catch(error => res.status(400).send());
});

router.get('/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (!user) {
				return res.status(404).send();
			}
			user = user.toPublic();
			res.json({ user });
		})
		.catch(error => res.status(400).send());
});

router.get('/:userId/issues', (req, res) => {
	User.findById(req.params.userId)
		.then(user => {
			if (!user) {
				return res.status(404).send();
			}
			return user.findAllIssues();
		})
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	User.findByCredentials(email, password)
		.then(user => {
			return user.generateAuthToken()
				.then(token => {
					user = user.toPublic();
					res.header('x-auth', token.tokenVal).send({ user });
				});
		})
		.catch(error => res.status(404).send());
});

router.post('/signup', (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});  // user with id = null
	user.save()
		.then(_user => {
			return _user.generateAuthToken()  // user with an id
				.then(token => {
					_user = _user.toPublic();
					res.header('x-auth', token.tokenVal).send({ user: _user });
				});
		})
		.catch(error => res.status(400).send());
});

module.exports = router;