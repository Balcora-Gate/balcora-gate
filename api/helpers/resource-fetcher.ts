import mongoose, { Model } from 'mongoose';
import { Response, Request, NextFunction } from 'express';

const populateAll = (
	model: mongoose.Model<mongoose.Document>,
	query: {
		[key: string]: string;
	} | {
		[x: string]: RegExp;
	},
	...keys: Array<{ key: string, model: mongoose.Model<mongoose.Document, {[key: string]: any}> }>
): mongoose.DocumentQuery<mongoose.Document[], mongoose.Document, {}> => {
	if (keys.length === 1) {
		return model.find(query).populate(keys[0].key);
	} else {
		return populateAll(model, query, ...keys.slice(0, -1)).populate(keys[keys.length - 1]);
	}
};

export default function (
	query: { 
		model: mongoose.Model<mongoose.Document, {[key: string]: any}>, key: string
	},
	options?: {
		explicit_filter?: { [key: string]: string },
		populate_keys?: Array<{ key: string, model: mongoose.Model<mongoose.Document, {[key: string]: any}> }>,
	}
) {
	console.log(options);
	return async function (req: Request, res: Response, next: NextFunction) {
		console.log(`Fetching resource with sessionID: ${req.sessionID}`);
		res.contentType(`text/plain`);
		try {
			console.log(query);
			const query_expr = options?.explicit_filter ?? (() => {
				if (query.key && (req.query[query.key] || req.body[query.key])) {
					return {
						[query.key]: new RegExp(req.query[query.key] || req.body[query.key])
					};
				}
				return {};
			})();
			console.log(query_expr);
			res.locals.data = await (async () => {
				if (!options?.populate_keys) {
					return query.model.find(query_expr).limit(30);
				} else {
					console.log(`populate!`);
					return populateAll(query.model, query_expr, ...options?.populate_keys).limit(30).exec();
				}
			})();
			// console.group(`res:`);
			// console.log(res.locals.data);
			// console.groupEnd();
		} catch (err) {
			console.log(err);
			res.status(404).end(`That's an error`);
			return;
		}
		next();
	}
}