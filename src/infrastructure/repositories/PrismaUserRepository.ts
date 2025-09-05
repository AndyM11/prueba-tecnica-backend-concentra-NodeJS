import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRole } from "../../domain/entities/Types";

export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) { }

    async create(user: Omit<User, "id">): Promise<User> {
        const created = await this.prisma.usuario.create({
            data: {
                username: user.username,
                passwordHash: user.passwordHash,
                rol: user.rol,
                empleadoId: user.employeeId ?? null,
            },
        });
        return this.toDomain(created);
    }

    async findById(id: number): Promise<User | null> {
        const found = await this.prisma.usuario.findUnique({ where: { id } });
        return found ? this.toDomain(found) : null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const found = await this.prisma.usuario.findUnique({ where: { username } });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.usuario.findMany();
        return users.map(this.toDomain);
    }

    async update(id: number, data: Partial<Omit<User, "id">>): Promise<User | null> {
        const updated = await this.prisma.usuario.update({
            where: { id },
            data: {
                username: data.username,
                passwordHash: data.passwordHash,
                rol: data.rol,
                empleadoId: data.employeeId,
            },
        });
        return updated ? this.toDomain(updated) : null;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.usuario.delete({ where: { id } });
    }

    async existsByUsername(username: string): Promise<boolean> {
        const user = await this.prisma.usuario.findUnique({ where: { username } });
        return !!user;
    }

    private toDomain(record: any): User {
        return new User(
            record.id,
            record.username,
            record.passwordHash,
            record.rol as UserRole,
            record.empleadoId ?? null
        );
    }
}
