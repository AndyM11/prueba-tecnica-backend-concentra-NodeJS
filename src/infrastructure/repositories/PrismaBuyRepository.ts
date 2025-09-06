import { Buy } from "../../domain/entities/Buy";
import { BuyRepository } from "../../domain/repositories/BuyRepository";
import { BuyFilters } from "../../domain/entities/Types";
// Definir tipo de filtros localmente si no está exportado

import { PrismaClient, Prisma } from "@prisma/client";

export class PrismaBuyRepository implements BuyRepository {
  async findById(id: number): Promise<Buy | null> {
    return this.getById(id);
  }

  async findByFilter(options?: {
    clientId?: number;
    placementId?: number;
    units?: number;
    page?: number;
    per_page?: number;
  }): Promise<{ data: Buy[]; total: number; page: number; per_page: number }> {
    const where: Prisma.CompraWhereInput = {};
    if (options?.clientId) where.clienteId = options.clientId;
    if (options?.placementId) where.colocacionId = options.placementId;
    if (options?.units !== undefined) where.unidades = options.units;
    const page = options?.page ? Number(options.page) : 1;
    const per_page = options?.per_page ? Number(options.per_page) : 10;
    const skip = (page - 1) * per_page;
    const [results, total] = await Promise.all([
      this.prisma.compra.findMany({ where, skip, take: per_page }),
      this.prisma.compra.count({ where }),
    ]);
    return {
      data: results.map((r) => ({
        id: r.id,
        clientId: r.clienteId,
        placementId: r.colocacionId,
        units: r.unidades,
      })),
      total,
      page,
      per_page,
    };
  }
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(buy: Buy): Promise<Buy> {
    // Mapear campos de Buy (inglés) a Compra (español)
    const created = await this.prisma.compra.create({
      data: {
        id: buy.id,
        clienteId: buy.clientId,
        colocacionId: buy.placementId,
        unidades: buy.units,
      },
    });
    // Mapear de vuelta a Buy
    return {
      id: created.id,
      clientId: created.clienteId,
      placementId: created.colocacionId,
      units: created.unidades,
    };
  }

  async update(
    id: number,
    data: Partial<Omit<Buy, "id">>,
  ): Promise<Buy | null> {
    const updated = await this.prisma.compra.update({
      where: { id },
      data: {
        clienteId: data.clientId,
        colocacionId: data.placementId,
        unidades: data.units,
      },
    });
    return updated
      ? {
        id: updated.id,
        clientId: updated.clienteId,
        placementId: updated.colocacionId,
        units: updated.unidades,
      }
      : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.compra.delete({ where: { id } });
  }

  async getById(id: number): Promise<Buy | null> {
    const found = await this.prisma.compra.findUnique({ where: { id } });
    return found
      ? {
        id: found.id,
        clientId: found.clienteId,
        placementId: found.colocacionId,
        units: found.unidades,
      }
      : null;
  }

  async getAll(filters: BuyFilters): Promise<Buy[]> {
    const where: Prisma.CompraWhereInput = {};
    if (filters.placementId) where.colocacionId = filters.placementId;
    if (filters.clientId) where.clienteId = filters.clientId;
    if (filters.units !== undefined) where.unidades = filters.units;
    const results = await this.prisma.compra.findMany({ where });
    return results.map((r) => ({
      id: r.id,
      clientId: r.clienteId,
      placementId: r.colocacionId,
      units: r.unidades,
    }));
  }
}
