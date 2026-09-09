import { User } from "../entities/User";

export function removePassword(user: User): Omit<User, "senha"> {
  const { senha: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
