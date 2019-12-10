import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import resourceFetcher from '../helpers/resource-fetcher';
import resourcePoster from '../helpers/resource-poster';
import appSession from '../middleware/redis-session';
import { validSession, SESSION_TYPE } from '../middleware/valid-session';

const router = express.Router();

router.get(`/show`, resourceFetcher({ model: User, key: `name` }), (req, res, next) => {
	if (!req.sessionID) {
		res.redirect(`/`);
	}
	res.send(res.locals.data);
});

router.get(`/validate`,
	appSession,
	validSession(SESSION_TYPE.USER),
	(req, res) => {
		res.status(200).end();
	});

router.post(`/passcheck`,
	appSession,
	validSession(SESSION_TYPE.USER),
	resourceFetcher({ model: User, key: `name` }),
	async (req, res) => {
		if (await bcrypt.compare(req.body.pass, res.locals.data[0].pass)) {
			console.log(`ok`);
			res.status(200).end();
		} else {
			res.status(401).end(`INVALID PASS`);
		}
	});

// session user => create entry in db => response
router.post(`/create`, appSession, validSession(SESSION_TYPE.ANON, SESSION_TYPE.NO_SESSION), resourcePoster({ model: User }), (req, res) => {
	console.log(req.sessionID);
	req.session!.user_name = req.body.name;
	res.status(200).cookie(`user_name`, req.body.name).send();
});
// session user => response
router.post(
	`/login`,
	appSession,
	validSession(SESSION_TYPE.ANON, SESSION_TYPE.NO_SESSION, SESSION_TYPE.USER),
	resourceFetcher({ model: User, key: `name` }),
	async (req, res, next) => {
		console.log(req.body);
		console.log(`got:`);
		console.log(res.locals.data);
		if (!res.locals.data.length) {
			res.status(401).end(`Incorrect username or password.`);
			return;
		}
		console.log(res.locals.data[0]);
		console.log(`---->>`);
		if (await bcrypt.compare(req.body.pass, res.locals.data[0].pass)) {
			console.log(`matching passwords`);
			next();
		} else {
			console.log(`Incorrect password`);
			res.status(401).end(`Incorrect username or password.`);
			return;
		}
	},
	(req, res, next) => {
		req.session!.user_name = req.body.name;
		res.locals.data = {};
		res.status(200).cookie(`user_name`, req.body.name, { 
			secure: process.env.NODE_ENV === `production`,
			maxAge: req.session!.cookie.maxAge!
		}).send();
	}
);

router.post(`/logout`, appSession, async (req, res, next) => {
	res.type(`text/plain`);
	try {
		await new Promise((res, rej) => {
			req.session!.destroy((err) => {
				if (err) rej(err);
				res();
			});
		});
		console.log(`Logged out successfully`);
		res.status(200).end(`Logged out successfully`);
	} catch (err) {
		console.log(err);
		res.status(400).end(`Error logging out: ${err}`);
	}
});

export default router;