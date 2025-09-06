import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { UserRole } from "../../entities/Types";
import bcrypt from "bcryptjs";

export class CreateUserUseCase {
  constructor(private repo: UserRepository) {}

  private validatePassword(password: string): boolean {
    // Longitud >= 10, al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 caracter especial
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/.test(
      password,
    );
  }

  async execute(params: {
    username: string;
    password: string;
    rol: UserRole;
    employeeId?: number | null;
  }): Promise<User> {
    // Validar robustez de la contraseña
    if (!this.validatePassword(params.password)) {
      // Si la contraseña no cumple los requisitos mínimos, lanzar error
      throw new Error(
        "La contraseña no cumple con los requisitos de robustez.",
      );
    }
    // Validar unicidad del nombre de usuario
    if (await this.repo.existsByUsername(params.username)) {
      // Si el nombre de usuario ya existe, lanzar error
      throw new Error("El nombre de usuario ya existe.");
    }
    // Hashear la contraseña antes de guardar
    const passwordHash = await bcrypt.hash(params.password, 10);
    const { password, ...rest } = params;
    const user = await this.repo.create({
      ...rest,
      passwordHash,
    });
    return user;
  }
}
