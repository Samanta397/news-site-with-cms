import { PrismaUser } from '~/types/user.types';

export function prepareUsers(users: PrismaUser[]) {
  return users.map((user) => ({
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name}`,
    role: user.role,
  }));
}
