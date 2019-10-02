import express from 'express';
import Ship from '../models/ship';
import resourceFetcher from '../helpers/resource-fetcher';

const router = express.Router();

router.route(`/`)
	.get(resourceFetcher({ model: Ship, key: `name` }), (req, res, next) => {
		res.status(200).send(res.locals.data);
	});

export default router;