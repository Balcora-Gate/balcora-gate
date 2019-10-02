import express from 'express';
import Guide from '../models/guide';
import resourceFetcher from '../helpers/resource-fetcher';
import resourcePoster from '../helpers/resource-poster';
import appSession from '../middleware/redis-session';
import { validSession, SESSION_TYPE } from '../middleware/valid-session';

const router = express.Router();

router.get(`/`, resourceFetcher({ model: Guide, key: `slug` }), (req, res, next) => {
		res.send(res.locals.data);
	});
router.post(`/create`,
	appSession, 
	validSession(SESSION_TYPE.USER), 
	(req, res, next) => {
		req.body.user = req.session!.user_name;
		next();
	}, 
	resourcePoster({ model: Guide }), 
	(req, res) => {
		res.status(200).end();
	}
);

export default router;