export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
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
