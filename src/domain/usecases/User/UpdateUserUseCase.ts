import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { UserRole } from "../../entities/Types";

export class UpdateUserUseCase {
  constructor(private repo: UserRepository) {}

  private validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/.test(
      password,
    );
  }

  async execute(
    id: number,
    data: Partial<{
      username: string;
      password: string;
      rol: UserRole;
      employeeId?: number | null;
    }>,
  ): Promise<User | null> {
    if (data.password && !this.validatePassword(data.password)) {
      // Validar robustez de la nueva contraseña si se proporciona
      if (data.password && !this.validatePassword(data.password)) {
        // Si la contraseña no cumple los requisitos mínimos, lanzar error
        throw new Error(
          "La contraseña no cumple con los requisitos de robustez.",
        );
      }
    }
    if (data.username && (await this.repo.existsByUsername(data.username))) {
      // Validar unicidad del nombre de usuario si se proporciona
      if (data.username && (await this.repo.existsByUsername(data.username))) {
        // Si el nombre de usuario ya existe para otro usuario, lanzar error
        throw new Error("El nombre de usuario ya existe.");
      }
    }
    let passwordHash: string | undefined = undefined;
    if (data.password) {
      // Hashear la nueva contraseña antes de guardar
      passwordHash = await bcrypt.hash(data.password, 10);
    }
    const updated = await this.repo.update(id, {
      username: data.username,
      passwordHash,
      rol: data.rol,
      employeeId: data.employeeId,
    });
    return updated;
  }
}
