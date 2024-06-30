export type RegisterForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: Role;
};

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UpdateUserData = {
  id: number;
  isAdmin?: boolean;
} & Partial<User>;

export type LoginForm = {
  email: string;
  password: string;
};

export enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}
