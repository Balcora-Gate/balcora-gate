import { Application } from 'express';

import article from './article';
import gamedata from './gamedata';
import guide from './guide';
import guide_tag from './guide-tag';
import user from './user';

export default function (app: Application) {
	app.use(`/api/article`, article);
	app.use(`/api/data`, gamedata);
	app.use(`/api/guide`, guide);
	app.use(`/api/guide-tag`, guide_tag);
	app.use(`/api/user`, user);
}