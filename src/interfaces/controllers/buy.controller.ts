import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { PrismaBuyRepository } from "../../infrastructure/repositories/PrismaBuyRepository";
import { PrismaClient } from "@prisma/client";
import { CreateBuyUseCase } from "../../domain/usecases/Buy/CreateBuyUseCase";
import { UpdateBuyUseCase } from "../../domain/usecases/Buy/UpdateBuyUseCase";
import { DeleteBuyUseCase } from "../../domain/usecases/Buy/DeleteBuyUseCase";
import { GetBuyByIdUseCase } from "../../domain/usecases/Buy/GetBuyByIdUseCase";
import { GetAllBuysUseCase } from "../../domain/usecases/Buy/GetAllBuysUseCase";
import redis from "../../infrastructure/redisClient";

const buyRepo = new PrismaBuyRepository(new PrismaClient());
const createBuyUseCase = new CreateBuyUseCase(buyRepo);
const updateBuyUseCase = new UpdateBuyUseCase(buyRepo);
const deleteBuyUseCase = new DeleteBuyUseCase(buyRepo);
const getBuyByIdUseCase = new GetBuyByIdUseCase(buyRepo);
const getAllBuysUseCase = new GetAllBuysUseCase(buyRepo);

const buySchema = z.object({
  clientId: z.number(),
  placementId: z.number(),
  units: z.number().min(1, "Las unidades deben ser al menos 1"),
});

export const createBuy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = buySchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const result = await createBuyUseCase.execute(parse.data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateBuy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = buySchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const result = await updateBuyUseCase.execute(
      Number(req.params.id),
      parse.data,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBuy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteBuyUseCase.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getBuyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `buys:${id}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const result = await getBuyByIdUseCase.execute(Number(id));
    if (!result) return res.status(404).send();
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la compra", details: error instanceof Error ? error.message : error });
  }
};

export const getAllBuys = async (req: Request, res: Response) => {
  const cacheKey = `buys:all:${JSON.stringify(req.query)}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const result = await getAllBuysUseCase.execute(req.query);
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las compras", details: error instanceof Error ? error.message : error });
  }
};

