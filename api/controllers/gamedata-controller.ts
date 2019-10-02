import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
	// res.render(`gamedata/index`, res.locals);
	res.send(res.locals.data);
};
