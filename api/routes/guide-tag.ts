import express from 'express';
import GuideTag from '../models/guide-tag';
import resourceFetcher from '../helpers/resource-fetcher';

const router = express.Router();

router.get(`/`, resourceFetcher({ model: GuideTag, key: `text` }), (req, res, next) => {
	res.send(res.locals.data);
});

export default router;