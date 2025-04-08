import { z } from 'zod';

export const completeInputSchema = z.object({
	answer: z.string({
		required_error: "Field 'answer' is required"
	})
});

export type CompleteInput = z.infer<typeof completeInputSchema>;
