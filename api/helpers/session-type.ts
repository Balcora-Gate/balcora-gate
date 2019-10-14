import * as sess from '../middleware/redis-session';
import { Request, Response, NextFunction } from 'express'
import { Z_UNKNOWN } from 'zlib';

export const enum SESSION_TYPE {
	UNKNOWN = 0,
	NO_SESSION,
	ANON,
	UNTRACKED,
	USER
};
export const sessionType = (req: Request): Promise<SESSION_TYPE> => {
	console.log(req.session);
	return new Promise((res) => {
		if (!req.session) {
			console.log(`sol, no session`);
			res(SESSION_TYPE.NO_SESSION);
		} else if (!req.session!.user_name) {
			console.log(`anon session`)
			res(SESSION_TYPE.ANON);
		} else {
			sess.redis_client.exists(`sess:${req.sessionID}`, function (err, reply) {
				console.log(`key is: ${req.sessionID}`);
				console.log(`redis says:`);
				console.log(err);
				console.log(reply);
				if (err || reply === 0) {
					console.log(`session doesn't exist in redis, probably spoofed`)
					res(SESSION_TYPE.UNTRACKED);
				} else {
					console.log(`user: ${req.session!.user_name}`);
					res(SESSION_TYPE.USER);
				}
			});
		}
	});
}