import { PrismaClient, Prisma } from "@prisma/client";
import { Placement } from "../../domain/entities/Placement";
import { PlacementRepository } from "../../domain/repositories/PlacementRepository";
import { PlacementFilterOptions } from "../../domain/entities/Types";

type PlacementDbUpdate = {
  articuloId?: number;
  ubicacionId?: number;
  nombreExhibido?: string;
  precio?: number;
};


export class PrismaPlacementRepository implements PlacementRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance ?? new PrismaClient();
  }

  async findAll(): Promise<Placement[]> {
    const data = await this.prisma.colocacion.findMany();
    return data.map(
      (p) =>
        new Placement(
          p.id,
          p.articuloId,
          p.ubicacionId,
          p.nombreExhibido,
          Number(p.precio),
        ),
    );
  }

  async findById(id: number): Promise<Placement | null> {
    const p = await this.prisma.colocacion.findUnique({ where: { id } });
    return p
      ? new Placement(
        p.id,
        p.articuloId,
        p.ubicacionId,
        p.nombreExhibido,
        Number(p.precio),
      )
      : null;
  }

  async create(data: Omit<Placement, "id">): Promise<Placement> {
    // Mapear campos de inglés a español para la base de datos
    const dbData = {
      articuloId: data.articleId,
      ubicacionId: data.locationId,
      nombreExhibido: data.displayName,
      precio: data.price,
    };
    const p = await this.prisma.colocacion.create({ data: dbData });
    return new Placement(
      p.id,
      p.articuloId,
      p.ubicacionId,
      p.nombreExhibido,
      Number(p.precio),
    );
  }

  async update(
    id: number,
    data: Partial<Omit<Placement, "id">>,
  ): Promise<Placement | null> {
    // Mapear campos de inglés a español para la base de datos
    const dbData: PlacementDbUpdate = {};
    if (typeof data.articleId !== "undefined")
      dbData.articuloId = data.articleId;
    if (typeof data.locationId !== "undefined")
      dbData.ubicacionId = data.locationId;
    if (typeof data.displayName !== "undefined")
      dbData.nombreExhibido = data.displayName;
    if (typeof data.price !== "undefined") dbData.precio = data.price;
    const p = await this.prisma.colocacion.update({ where: { id }, data: dbData });
    return p
      ? new Placement(
        p.id,
        p.articuloId,
        p.ubicacionId,
        p.nombreExhibido,
        Number(p.precio),
      )
      : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.colocacion.delete({ where: { id } });
  }

  async findByFilter(
    options: PlacementFilterOptions = {},
  ): Promise<{
    total: number;
    data: Placement[];
    page: number;
    per_page: number;
  }> {
    const {
      articleId,
      locationId,
      displayName,
      price,
      page = 1,
      per_page = 10,
    } = options;
    const where: Prisma.ColocacionWhereInput = {};
    if (articleId) where.articuloId = articleId;
    if (locationId) where.ubicacionId = locationId;
    if (displayName) where.nombreExhibido = { contains: displayName };
    if (price) where.precio = price;
    const total = await this.prisma.colocacion.count({ where });
    const data = await this.prisma.colocacion.findMany({
      where,
      skip: (page - 1) * per_page,
      take: per_page,
    });
    return {
      total,
      data: data.map(
        (p) =>
          new Placement(
            p.id,
            p.articuloId,
            p.ubicacionId,
            p.nombreExhibido,
            Number(p.precio),
          ),
      ),
      page,
      per_page,
    };
  }
}
