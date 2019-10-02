import mongoose from 'mongoose';
import Article from '../models/article';

import { Response, Request, NextFunction } from 'express';

export default async function (req: Request, res: Response, next: NextFunction) {
	const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@balcora-0jmga.mongodb.net/test?retryWrites=true&w=majority`;
	const client = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: `site_content` }, (err) => {
		if (err) {
			throw (err);
		}
	});
	const db = client.connection;
	db.on('error', (err) => {
		console.log(err);
		throw (err);
	});

	console.log(`trying to get ${req.query.name}`)
	const article = await Article.findOne({"name": req.query.name});
	res.locals.article = article;
	db.close((err) => {
		if (err) {
			throw (err);
		}
	});
	next();
}
