import redis from 'redis';
import session from 'express-session';
import connect_redis from 'connect-redis';
console.log(process.env.REDIS_URL);
console.log(`-->`);
export const redis_client = (() => {
	if (process.env.NODE_ENV === `production`) {
		return redis.createClient({
			url: process.env.REDIS_URL!
		});
	} else {
		return redis.createClient({
			port: 6379,
			host: `127.0.0.1`
		});
	}
})();
redis_client.on(`error`, console.log);
redis_client.on(`connect`, console.log);
const RedisStore = connect_redis(session);
import uuid from 'uuid';

console.log(`Exporting session with 'proxy: ${(process.env.NODE_ENV === `production`)}'`);

const store = (() => {
	if (process.env.NODE_ENV === `production`) {
		return new RedisStore({ client: redis_client });
	}
	return new RedisStore({ client: redis_client, ttl: 48000 });
})();
export default session({
	secret: process.env.REDIS_SECRET!,
	resave: false,
	saveUninitialized: true,
	cookie: { 
		secure: process.env.NODE_ENV === `production`, 
		maxAge: 1000 * 60 * 60 * 24 * 5,
		path: `/`,
		httpOnly: (process.env.NODE_ENV === `production`)
	},
	proxy: (process.env.NODE_ENV === `production`),
	store: store,
	genid: (req) => {
		console.log(`gen id for ${req}`);
		return uuid.v4();
	}
});