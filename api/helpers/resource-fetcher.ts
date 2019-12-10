import mongoose from 'mongoose';
import { Response, Request, NextFunction } from 'express';

export default function (
	query: { 
		model: mongoose.Model<mongoose.Document, {[key: string]: any}>, key: string
	},
	explicit_filter?: { [key: string]: string }
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		console.log(`Fetching resource with sessionID: ${req.sessionID}`);
		res.contentType(`text/plain`);
		try {
			console.log(query);
			const query_expr = explicit_filter ? explicit_filter : (() => {
				if (query.key && (req.query[query.key] || req.body[query.key])) {
					return {
						[query.key]: new RegExp(req.query[query.key] || req.body[query.key])
					};
				}
				return {};
			})();
			console.log(query_expr);
			res.locals.data = await query.model.find(query_expr).limit(30);
			console.log(res.locals.data);
		} catch (err) {
			console.log(err);
			res.status(404).end(`That's an error`);
			return;
		}
		next();
	}
}