import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { AppError } from "../errors/AppError";
import { hashPassword } from "../utils/password";

export class UserService {
  async createUser(userData: CreateUserDTO): Promise<User> {
    const existingUser = await UserRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError("Email já cadastrado.", 409);
    }

    const hashedPassword = await hashPassword(userData.senha);

    const newUser = UserRepository.create({
      ...userData,
      senha: hashedPassword,
    });

    return await UserRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await UserRepository.findOne({ where: { id } });
  }
}
