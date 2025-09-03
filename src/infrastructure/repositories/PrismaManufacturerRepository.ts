import { ManufacturerRepository } from '../../domain/repositories/ManufacturerRepository';
import { Manufacturer } from '../../domain/entities/Manufacturer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaManufacturerRepository implements ManufacturerRepository {
    async findAll(): Promise<Manufacturer[]> {
        const manufacturers = await prisma.fabricante.findMany();
        return manufacturers.map(m => new Manufacturer(m.id, m.nombre));
    }

    async findByFilter(options: {
        name?: string;
        page?: number;
        per_page?: number;
    }): Promise<{ total: number; data: Manufacturer[]; current_page: number; per_page: number; last_page: number }> {
        const { name, page = 1, per_page = 10 } = options;
        const where: any = {};
        if (name) {
            where.nombre = { contains: name, mode: 'insensitive' };
        }
        const total = await prisma.fabricante.count({ where });
        const last_page = Math.ceil(total / per_page);
        const manufacturers = await prisma.fabricante.findMany({
            where,
            skip: (page - 1) * per_page,
            take: per_page,
            orderBy: { id: 'asc' }
        });
        return {
            total,
            data: manufacturers.map(m => new Manufacturer(m.id, m.nombre)),
            current_page: page,
            per_page,
            last_page
        };
    }

    async findById(id: number): Promise<Manufacturer | null> {
        const m = await prisma.fabricante.findUnique({ where: { id: Number(id) } });
        return m ? new Manufacturer(m.id, m.nombre) : null;
    }

    async create(name: string): Promise<Manufacturer> {
        const m = await prisma.fabricante.create({ data: { nombre: name } });
        return new Manufacturer(m.id, m.nombre);
    }

    async update(id: number, name: string): Promise<Manufacturer> {
        const m = await prisma.fabricante.update({ where: { id }, data: { nombre: name } });
        return new Manufacturer(m.id, m.nombre);
    }

    async delete(id: number): Promise<void> {
        await prisma.fabricante.delete({ where: { id } });
    }
}
