import { AppealStatus } from '@prisma/client';
import { z } from 'zod';

export const changeAppealInputSchema = z.object({
	status: z.nativeEnum(AppealStatus, {
		required_error: "Field 'status' is required"
	})
});

export type ChangeAppealInput = z.infer<typeof changeAppealInputSchema>;
