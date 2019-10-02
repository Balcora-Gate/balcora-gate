import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
	console.log(`home`);
	res.render(`home/index`, {
		title: `Home`
	});
};