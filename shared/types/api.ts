import { z } from 'zod';

export type APIResponse<T extends (...args: unknown[]) => unknown> = Awaited<ReturnType<T>>;

export const IdSchema = z.coerce.number().int().positive();
export const IdParamSchema = z.object({ id: IdSchema });

export type DbId = z.infer<typeof IdSchema>;
