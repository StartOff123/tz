import { Appeal, AppealStatus } from '@prisma/client';

import { db } from '~core/db';

import { existAppeal } from '~utils/exist-appeal.util';

import { AppealType } from './appeal.types';
import { CreateAppealInput } from './inputs/create-appeal.input';

export class AppealService {
	// Method to get all appeals
	async findAll(query: AppealType.FindAllQuery): Promise<Appeal[]> {
		return await db.appeal.findMany({
			where: {
				createdAt: {
					gte: query.dateFrom ? query.dateFrom : undefined,
					lte: query.dateTo ? query.dateTo : undefined
				}
			}
		});
	}

	// Method to create a new appeal
	async create(input: CreateAppealInput): Promise<Appeal> {
		return await db.appeal.create({
			data: {
				...input,
				status: AppealStatus.NEW
			}
		});
	}

	// Method to change the status of an appeal
	async changeStatus(id: string, status: AppealStatus): Promise<Appeal> {
		await existAppeal(id);

		return await db.appeal.update({
			where: {
				id
			},
			data: {
				status
			}
		});
	}

	// Method to complete an appeal
	async complete(id: string, answer: string): Promise<Appeal> {
		await existAppeal(id);

		return await db.appeal.update({
			where: {
				id
			},
			data: {
				answer,
				status: AppealStatus.COMPLETED
			}
		});
	}

	// Method to cancel an appeal
	async cancellation(id: string, answer: string): Promise<Appeal> {
		await existAppeal(id);

		return await db.appeal.update({
			where: {
				id
			},
			data: {
				answer,
				status: AppealStatus.CANCELED
			}
		});
	}

	// Method to cancel all appeals
	async cancellationAll(): Promise<string> {
		await db.appeal.updateMany({
			where: {
				status: AppealStatus.IN_PROCCESS
			},
			data: {
				answer: 'Appeal canceled is automatically',
				status: AppealStatus.CANCELED
			}
		});

		return 'Appeals canceled successfully';
	}
}
