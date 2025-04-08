import { z } from 'zod';

export const createAppealInputSchema = z.object({
	theme: z.string({
		required_error: "Field 'theme' is required"
	}),
	body: z.string({
		required_error: "Field 'body' is required"
	})
});

export type CreateAppealInput = z.infer<typeof createAppealInputSchema>;
