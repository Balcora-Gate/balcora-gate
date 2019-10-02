import dotenv from 'dotenv-flow';
dotenv.config({
	path: `${__dirname}/../`,
});
if (process.env.NODE_ENV === `development`) {
	process.env.PORT = `4040`;
}

import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import serveStatic from 'serve-static';

export const app = express();
app.use(serveStatic(`../dist`));
app.set(`trust proxy`, (process.env.NODE_ENV === `production`));

app.use(cors({
	credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));

routes(app);
app.use((req, res, next) => {
	res.status(404).json({
		message: `Oops! The page ${req.url} doesn't exist!`,
		status: res.statusCode
	});
	next();
});

console.log(app.get(`env`))
if (app.get(`env`) === `development`) {
	http.createServer(app).listen(parseInt(process.env.PORT!) + 1, () => {
		console.log(`http is listening on ${parseInt(process.env.PORT!) + 1}`);
	})

	https.createServer({
		cert: fs.readFileSync(`server.cert`),
		key: fs.readFileSync(`server.key`)
	}, app).listen(parseInt(process.env.PORT!), () => {
		console.log(`https is listening on ${process.env.PORT}.`);
		console.log(`THE PATH TO SAJUUK`);
	});
} else {
	app.listen(process.env.PORT, () => {
		console.log(`Production mode, using cors and all that ish`);
		console.log(`Listening on port ${process.env.PORT}`);
		console.log(`THE PATH TO SAJUUK`);
	});
}