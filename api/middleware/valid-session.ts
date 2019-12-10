import { sessionType, SESSION_TYPE } from '../helpers/session-type';
export { SESSION_TYPE } from '../helpers/session-type';
import { Request, Response, NextFunction } from 'express';

export function validSession (...session_types: Array<SESSION_TYPE>) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const session_type = await sessionType(req);
		console.log(`got type: ${session_type}`)
		console.log(`check it matches any of:`);
		console.log(session_types);
		if (!session_types.includes(session_type)) {
			console.log(`fail!`);
			res.status(401).end(`Unauthenticated`);
		} else {
			console.log(req.cookies);
			console.log(req.session);
			if (session_type !== 2) {
				console.log(req.cookies);
				if (!req.cookies) {
					res.cookie(`user_name`, req.session!.user_name);
					console.log(`no user cookie set...`);
					res.status(400).end();
				}
				if (req.session!.user_name !== req.cookies!.user_name) {
					console.log(`req session user and browser's user are not the same!`);
					req.session!.destroy((err) => {
						console.log(err);
					});
					req.cookies.user_name = null;
					res.status(401).cookie(`user_name`, null, { maxAge: -1 }).end(`Invalid session, please try relogging.`);
					return;
				}
			}
			console.log(`success!`);
			next();
		}
	}	
}