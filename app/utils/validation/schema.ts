import { z } from 'zod';

type inferSafeParseErrors<T extends z.ZodType<any, any, any>, U = string> = {
  formErrors: U[];
  fieldErrors?: {
    [P in keyof z.infer<T>]?: U[];
  };
};

export const LoginFields = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginFields = z.infer<typeof LoginFields>;
export type LoginFieldsErrors = inferSafeParseErrors<typeof LoginFields>;
