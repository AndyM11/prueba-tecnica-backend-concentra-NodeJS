
import { PrismaClient } from '@prisma/client';
import { Client } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';

const prisma = new PrismaClient();

export class PrismaClientRepository implements ClientRepository {
    async create(data: Omit<Client, 'id'>): Promise<any> {
        // Mapear campos de inglés a español para la base de datos
        const dbData = {
            nombre: data.name,
            telefono: data.phone,
            tipoCliente: data.clientType
        };
        const c = await prisma.cliente.create({ data: dbData });
        return {
            id: c.id,
            name: c.nombre,
            phone: c.telefono,
            clientType: c.tipoCliente
        };
    }

    async findById(id: number): Promise<any | null> {
        const c = await prisma.cliente.findUnique({ where: { id } });
        return c
            ? {
                id: c.id,
                name: c.nombre,
                phone: c.telefono,
                clientType: c.tipoCliente
            }
            : null;
    }

    async findAll(params: { page?: number; per_page?: number; name?: string; phone?: string; clientType?: string } = {}): Promise<{ data: any[]; total: number; page: number; per_page: number }> {
        const { page = 1, per_page = 10, name, phone, clientType } = params;
        const where: any = {};
        if (name) where.nombre = { contains: name };
        if (phone) where.telefono = { contains: phone };
        if (clientType) where.tipoCliente = clientType;
        const [total, data] = await Promise.all([
            prisma.cliente.count({ where }),
            prisma.cliente.findMany({
                where,
                skip: (page - 1) * per_page,
                take: per_page,
            }),
        ]);
        return {
            data: data.map(c => ({
                id: c.id,
                name: c.nombre,
                phone: c.telefono,
                clientType: c.tipoCliente
            })),
            total,
            page,
            per_page
        };
    }

    async update(id: number, data: Partial<Omit<Client, 'id'>>): Promise<any | null> {
        try {
            // Mapear campos de inglés a español para la base de datos
            const dbData: any = {};
            if (typeof data.name !== 'undefined') dbData.nombre = data.name;
            if (typeof data.phone !== 'undefined') dbData.telefono = data.phone;
            if (typeof data.clientType !== 'undefined') dbData.tipoCliente = data.clientType;
            const c = await prisma.cliente.update({ where: { id }, data: dbData });
            return {
                id: c.id,
                name: c.nombre,
                phone: c.telefono,
                clientType: c.tipoCliente
            };
        } catch {
            return null;
        }
    }

    async delete(id: number): Promise<void> {
        await prisma.cliente.delete({ where: { id } });
    }
}