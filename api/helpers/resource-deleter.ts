import mongoose from 'mongoose';
import { Response, Request, NextFunction } from 'express';

export default (query: { model: mongoose.Model<mongoose.Document, {[key: string]: any}>, key: string },
				document?: { [key: string]: any },
				explicit_filter?: { [key: string]: string }) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		console.log(`updating resource`);
		res.contentType(`text/plain`);
		try {
			const query_expr = explicit_filter ? explicit_filter : (() => {
				if (query.key && (req.query[query.key] || req.body[query.key])) {
					return {
						[query.key]: new RegExp(req.query[query.key] || req.body[query.key])
					};
				}
				return {};
			})();
			if (query_expr === {}) {
				console.log(`Warning: deleting with empty query.`);
				res.write(`Warning: deleting with empty query.`);
			}
			console.log(document || req.body);
			await query.model.deleteOne(query_expr, (document || req.body));
			console.log(`delete success`);
		} catch (err) {
			console.log(err);
			res.status(400).end(err.code.toString());
			return;
		}
		next();
	}
}