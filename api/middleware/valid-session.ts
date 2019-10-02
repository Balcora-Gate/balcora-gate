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
			console.log(`success!`);
			next();
		}
	}	
}