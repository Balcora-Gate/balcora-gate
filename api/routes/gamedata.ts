import express from 'express';
import Ship from '../models/ship';
import Subs from '../models/subs';
import resourceFetcher from '../helpers/resource-fetcher';
import Wepn from '../models/wepn';

const modelType = (req_type: string) => {
	switch(req_type) {
		case `ship`:
			return Ship;
		case `subs`:
		case `subsystem`:
			return Subs;
		case `weapon`:
		case `wepn`:
			return Wepn;
		default:
			return undefined;
	}
};

const router = express.Router();

// router.route(`/`)
// 	.get(resourceFetcher({ model: Ship, key: `name` }), (req, res, next) => {
// 		res.status(200).send(res.locals.data);
// 	});

router.get(`/`,
	async (req, res, next) => {
		console.log(req.query.type);
		const type = modelType(req.query.type);
		if (type === undefined) {
			res.write(`Resource type '${req.query.type}' is unrecognized.`)
			res.status(404).end();
			return;
		}
		resourceFetcher({ model: type, key: `name` })(req, res, next);
	}, (req, res) => {
		res.status(200).send(res.locals.data);
	});

export default router;