import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';

import { AppealService } from './appeal.service';
import { AppealType } from './appeal.types';
import { changeAppealInputSchema } from './inputs/change-status.input';
import { completeInputSchema } from './inputs/complete.input';
import { createAppealInputSchema } from './inputs/create-appeal.input';

class AppealController {
	// Creating the router
	public router = express.Router();
	// Creating the service
	public appealService = new AppealService();

	constructor() {
		// Initializing the routes
		this.initializeRoutes();
	}

	initializeRoutes() {
		// GET /appeal
		// Endpoint to get all appeals
		this.router.get(
			'/',
			asyncHandler(async (req: Request, res: Response) => {
				const query = req.query as AppealType.FindAllQuery;

				const appeals = await this.appealService.findAll(query);

				res.status(200).json(appeals);
			})
		);

		// POST /appeal/create
		// Endpoint to create a new appeal
		this.router.post(
			'/create',
			asyncHandler(async (req: Request, res: Response) => {
				const validation = await createAppealInputSchema.safeParseAsync(
					req.body
				);

				if (!validation.success) {
					throw createHttpError(
						400,
						validation.error.errors[0].message
					);
				}

				const appeal = await this.appealService.create(
					validation.data!
				);

				res.status(200).json(appeal);
			})
		);

		// PATCH /appeal/change-status/:id
		// id - appeal id
		// Endpoint to change the status of an appeal
		this.router.patch(
			'/change-status/:id',
			asyncHandler(async (req: Request, res: Response) => {
				const validation = await changeAppealInputSchema.safeParseAsync(
					req.body
				);
				const { id } = req.params as { id: string };

				if (!validation.success) {
					throw createHttpError(
						400,
						validation.error.errors[0].message
					);
				}

				const appeal = await this.appealService.changeStatus(
					id,
					validation.data!.status
				);

				res.status(200).json(appeal);
			})
		);

		// PATCH /appeal/complete/:id
		// id - appeal id
		// Endpoint to complete an appeal
		this.router.patch(
			'/complete/:id',
			asyncHandler(async (req: Request, res: Response) => {
				const validation = await completeInputSchema.safeParseAsync(
					req.body
				);
				const { id } = req.params as { id: string };

				if (!validation.success) {
					throw createHttpError(
						400,
						validation.error.errors[0].message
					);
				}

				const appeal = await this.appealService.complete(
					id,
					validation.data!.answer
				);

				res.status(200).json(appeal);
			})
		);

		// PATCH /appeal/cancellation/:id
		// id - appeal id
		// Endpoint to cancel an appeal
		this.router.patch(
			'/cancellation/:id',
			asyncHandler(async (req: Request, res: Response) => {
				const validation = await completeInputSchema.safeParseAsync(
					req.body
				);
				const { id } = req.params as { id: string };

				if (!validation.success) {
					throw createHttpError(
						400,
						validation.error.errors[0].message
					);
				}

				const appeal = await this.appealService.cancellation(
					id,
					validation.data!.answer
				);

				res.status(200).json(appeal);
			})
		);

		// GET /appeal/cancellation-all
		// Endpoint to cancel all appeals with IN_PROCCESS status
		this.router.get(
			'/cancellation-all',
			asyncHandler(async (_: Request, res: Response) => {
				const message = await this.appealService.cancellationAll();

				res.status(200).json({ message });
			})
		);
	}
}

export default new AppealController().router;
