import dotenv from 'dotenv';
import express from 'express';
import type { Application, NextFunction, Request, Response } from 'express';
import type { HttpError } from 'http-errors';

import appealController from './modules/appeal/appeal.controller';
import { General } from './types/general';

function main() {
	// Loading environment variables and set the port
	dotenv.config();
	const PORT = process.env.APP_PORT || 8082;

	// Creating the server
	const app: Application = express();
	app.use(express.json());

	app.use('/appeal', appealController);

	// Handling all non-existent endpoints
	app.all('*', (_, res) => {
		res.status(404).json({ message: 'Not found' });
	});

	// Handling errors
	app.use(
		(
			err: HttpError,
			req: Request,
			res: Response<General.Error>,
			next: NextFunction
		) => {
			console.log(err);
			res.status(err.statusCode).json({
				statusCode: err.statusCode,
				status: err.name,
				message: err.message
			});
		}
	);

	// Starting the server
	app.listen(PORT, () => {
		console.log(`Example app listening on port ${PORT}`);
	});
}

main();
