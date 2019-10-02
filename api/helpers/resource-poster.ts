import mongoose, { model } from 'mongoose';
import { Response, Request, NextFunction } from 'express';

export default (query: { model: mongoose.Model<mongoose.Document, {}> }, document?: { [key: string]: any }) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		res.contentType(`text/plain`);
		try {
			console.log(document || req.body);
			await query.model.create(document || req.body);
			console.log(`write success`);
		} catch (err) {
			console.log(err);
			res.status(400).end(err.code.toString());
			return;
		}
		next();
	}
}