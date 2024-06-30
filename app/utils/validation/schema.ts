import { z } from 'zod';
import { Role } from '~/types/user.types';

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

export const RegisterFields = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: z.nativeEnum(Role),
});

export type LoginFields = z.infer<typeof LoginFields>;
export type RegisterFields = z.infer<typeof RegisterFields>;
export type LoginFieldsErrors = inferSafeParseErrors<typeof LoginFields>;
export type RegisterFieldsErrors = inferSafeParseErrors<typeof RegisterFields>;
