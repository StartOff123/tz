import createHttpError from 'http-errors';

import { db } from '~core/db';

export const existAppeal = async (id: string): Promise<void> => {
	const appealExists = await db.appeal.findUnique({
		where: {
			id
		}
	});

	if (!appealExists) {
		throw createHttpError(404, 'Appeal not found');
	}
};
