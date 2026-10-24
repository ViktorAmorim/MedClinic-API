import { User, UserRole } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { AppError } from "../errors/AppError";
import { hashPassword } from "../utils/password";
import { EntityManager } from "typeorm";

export class UserService {
  async createUser(
    userData: CreateUserDTO,
    role: UserRole | null = null,
    manager?: EntityManager,
  ): Promise<User> {
    const existingUser = manager
      ? await manager.findOne(User, {
          where: { email: userData.email },
        })
      : await UserRepository.findOne({
          where: { email: userData.email },
        });

    if (existingUser) {
      throw new AppError("Email já cadastrado.", 409);
    }

    const hashedPassword = await hashPassword(userData.senha);

    const newUser = manager
      ? manager.create(User, { ...userData, senha: hashedPassword, role })
      : UserRepository.create({
          ...userData,
          senha: hashedPassword,
          role,
        });

    return manager
      ? await manager.save(newUser)
      : await UserRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await UserRepository.findOne({ where: { id } });
  }
}
