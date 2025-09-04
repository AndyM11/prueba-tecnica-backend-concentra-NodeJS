import { PrismaClient } from '@prisma/client';
import { Placement } from '../../domain/entities/Placement';
import { PlacementRepository } from '../../domain/repositories/PlacementRepository';

const prisma = new PrismaClient();

export class PrismaPlacementRepository implements PlacementRepository {
    async findAll(): Promise<Placement[]> {
        const data = await prisma.colocacion.findMany();
        return data.map(p => new Placement(p.id, p.articuloId, p.ubicacionId, p.nombreExhibido, Number(p.precio)));
    }

    async findById(id: number): Promise<Placement | null> {
        const p = await prisma.colocacion.findUnique({ where: { id } });
        return p ? new Placement(p.id, p.articuloId, p.ubicacionId, p.nombreExhibido, Number(p.precio)) : null;
    }

    async create(data: Omit<Placement, 'id'>): Promise<Placement> {
        const p = await prisma.colocacion.create({ data });
        return new Placement(p.id, p.articuloId, p.ubicacionId, p.nombreExhibido, Number(p.precio));
    }

    async update(id: number, data: Partial<Omit<Placement, 'id'>>): Promise<Placement | null> {
        const p = await prisma.colocacion.update({ where: { id }, data });
        return p ? new Placement(p.id, p.articuloId, p.ubicacionId, p.nombreExhibido, Number(p.precio)) : null;
    }

    async delete(id: number): Promise<void> {
        await prisma.colocacion.delete({ where: { id } });
    }

    async findByFilter(options: any = {}): Promise<{ total: number; data: Placement[]; page: number; per_page: number }> {
        const {
            articuloId,
            ubicacionId,
            nombreExhibido,
            precio,
            page = 1,
            per_page = 10
        } = options;
        const where: any = {};
        if (articuloId) where.articuloId = articuloId;
        if (ubicacionId) where.ubicacionId = ubicacionId;
        if (nombreExhibido) where.nombreExhibido = { contains: nombreExhibido };
        if (precio) where.precio = precio;
        const total = await prisma.colocacion.count({ where });
        const data = await prisma.colocacion.findMany({
            where,
            skip: (page - 1) * per_page,
            take: per_page
        });
        return {
            total,
            data: data.map(p => new Placement(p.id, p.articuloId, p.ubicacionId, p.nombreExhibido, Number(p.precio))),
            page,
            per_page
        };
    }
}
