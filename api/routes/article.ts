import express from 'express';
import resourceFetcher from '../helpers/resource-fetcher';
import Article from '../models/article';
import appSession from '../middleware/redis-session';
import { validSession, SESSION_TYPE } from '../middleware/valid-session';

const router = express.Router();
router.route(`/`)
	.get(appSession, resourceFetcher({ model: Article, key: `slug` }), (req, res, next) => {
		console.log(req.sessionID);
		console.log(req.session);
		console.log(req.cookies);
		console.log(`--END REQ INFO--`);
		console.log(res.getHeaders());
		console.log(`---END RES HEADERS---`)
		res.status(200).send(res.locals.data);
	});

export default router;