import { PrismaClient, Prisma } from "@prisma/client";
import { Client } from "../../domain/entities/Client";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { ClientType } from "../../domain/entities/Types";
import { ClientFilterOptions } from "../../domain/entities/Types";


export class PrismaClientRepository implements ClientRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || new PrismaClient();
  }

  async findById(id: number): Promise<Client | null> {
    const c = await this.prisma.cliente.findUnique({ where: { id } });
    return c
      ? {
        id: c.id,
        name: c.nombre,
        phone: c.telefono,
        clientType: c.tipoCliente as ClientType,
      }
      : null;
  }

  async findAll(filters: ClientFilterOptions = {}): Promise<{
    data: Client[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const { name, phone, clientType, page = 1, per_page = 10 } = filters;
    const where: Prisma.ClienteWhereInput = {};
    if (name) where.nombre = { contains: name };
    if (phone) where.telefono = { contains: phone };
    if (clientType) where.tipoCliente = clientType;
    const skip = (page - 1) * per_page;
    const [data, total] = await Promise.all([
      this.prisma.cliente.findMany({ where, skip, take: per_page }),
      this.prisma.cliente.count({ where }),
    ]);
    return {
      data: data.map((c) => ({
        id: c.id,
        name: c.nombre,
        phone: c.telefono,
        clientType: c.tipoCliente as ClientType,
      })),
      total,
      page,
      per_page,
    };
  }

  async create(data: Omit<Client, "id">): Promise<Client> {
    const c = await this.prisma.cliente.create({
      data: {
        nombre: data.name,
        telefono: data.phone,
        tipoCliente: data.clientType,
      },
    });
    return {
      id: c.id,
      name: c.nombre,
      phone: c.telefono,
      clientType: c.tipoCliente as ClientType,
    };
  }

  async update(id: number, data: Partial<Omit<Client, "id">>): Promise<Client | null> {
    const dbData: Prisma.ClienteUpdateInput = {};
    if (typeof data.name !== "undefined") dbData.nombre = data.name;
    if (typeof data.phone !== "undefined") dbData.telefono = data.phone;
    if (typeof data.clientType !== "undefined") dbData.tipoCliente = data.clientType;
    try {
      const c = await this.prisma.cliente.update({ where: { id }, data: dbData });
      return {
        id: c.id,
        name: c.nombre,
        phone: c.telefono,
        clientType: c.tipoCliente as ClientType,
      };
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cliente.delete({ where: { id } });
  }
}