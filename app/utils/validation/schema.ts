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

export const NewsFields = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  author: z.string(),
  // tags: z.array(z.string()),
});

export type LoginFields = z.infer<typeof LoginFields>;
export type RegisterFields = z.infer<typeof RegisterFields>;
export type NewsFields = z.infer<typeof NewsFields>;

export type LoginFieldsErrors = inferSafeParseErrors<typeof LoginFields>;
export type RegisterFieldsErrors = inferSafeParseErrors<typeof RegisterFields>;
export type NewsFieldsErrors = inferSafeParseErrors<typeof NewsFields>;
