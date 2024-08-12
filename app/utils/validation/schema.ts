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
  author: z.string().nullish(),
  is_publish: z.string().nullish(),
  is_hidden: z.string().nullish(),
  image: z.instanceof(File).nullish(),

  // tags: z.array(z.string()),
});

export const SourceFields = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  name: z.string(),
  has_title: z.string().nullish(),
  has_content: z.string().nullish(),
  has_author: z.string().nullish(),
  has_pub_date: z.string().nullish(),
  is_active: z.string().nullish(),
  import_interval: z.string(),

  // tags: z.array(z.string()),
});

export const TagsFields = z.object({
  id: z.string().min(1),
  tagName: z.string().min(1),
});

export const AdsFields = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  link: z.string(),
  image: z.instanceof(File).nullish(),
  is_publish: z.string().nullish(),
  is_list_page: z.string().nullish(),
  is_search_page: z.string().nullish(),
  is_main_page: z.string().nullish(),
  is_filter_page: z.string().nullish(),
  priority: z.string().nullish(),
  regExp: z.string().nullish(),
  new: z.string().nullish(),
});

export const SettingsFields = z.object({
  amount_per_page: z.string().min(1),
});

export type LoginFields = z.infer<typeof LoginFields>;
export type RegisterFields = z.infer<typeof RegisterFields>;
export type NewsFields = z.infer<typeof NewsFields>;
export type TagsFields = z.infer<typeof TagsFields>;
export type SourceFields = z.infer<typeof SourceFields>;
export type AdsFields = z.infer<typeof AdsFields>;
export type SettingsFields = z.infer<typeof SettingsFields>;

export type LoginFieldsErrors = inferSafeParseErrors<typeof LoginFields>;
export type RegisterFieldsErrors = inferSafeParseErrors<typeof RegisterFields>;
export type NewsFieldsErrors = inferSafeParseErrors<typeof NewsFields>;
export type TagsFieldsErrors = inferSafeParseErrors<typeof TagsFields>;
export type SourceFieldsErrors = inferSafeParseErrors<typeof SourceFields>;
export type AdsFieldsErrors = inferSafeParseErrors<typeof AdsFields>;
export type SettingsFieldsErrors = inferSafeParseErrors<typeof SettingsFields>;
