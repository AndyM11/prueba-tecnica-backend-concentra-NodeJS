import { PrismaClient } from '@prisma/client';
import { Location } from '../../domain/entities/Location';
import { LocationRepository } from '../../domain/repositories/LocationRepository';

export class PrismaLocationRepository implements LocationRepository {
    private prisma: PrismaClient;
    constructor(prismaInstance?: PrismaClient) {
        this.prisma = prismaInstance || new PrismaClient();
    }

    async create(data: { name: string }): Promise<Location> {
        const loc = await this.prisma.ubicacion.create({ data: { nombre: data.name } });
        return new Location(loc.id, loc.nombre);
    }

    async getById(id: number): Promise<Location | null> {
        const loc = await this.prisma.ubicacion.findUnique({ where: { id } });
        return loc ? new Location(loc.id, loc.nombre) : null;
    }

    async getAll(): Promise<Location[]> {
        const locs = await this.prisma.ubicacion.findMany();
        return locs.map(loc => new Location(loc.id, loc.nombre));
    }

    async update(id: number, data: { name?: string }): Promise<Location | null> {
        const loc = await this.prisma.ubicacion.update({
            where: { id },
            data: { nombre: data.name },
        });
        return loc ? new Location(loc.id, loc.nombre) : null;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.ubicacion.delete({ where: { id } });
    }
}
