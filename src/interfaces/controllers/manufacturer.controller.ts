import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ManufacturerFilterOptions } from "../../domain/entities/Types";
import { CreateManufacturerUseCase } from "../../domain/usecases/Manufacturer/CreateManufacturerUseCase";
import { DeleteManufacturerUseCase } from "../../domain/usecases/Manufacturer/DeleteManufacturerUseCase";
import { GetAllManufacturersUseCase } from "../../domain/usecases/Manufacturer/GetAllManufacturersUseCase";
import { GetManufacturerByIdUseCase } from "../../domain/usecases/Manufacturer/GetManufacturerByIdUseCase";
import { UpdateManufacturerUseCase } from "../../domain/usecases/Manufacturer/UpdateManufacturerUseCase";
import { PrismaManufacturerRepository } from "../../infrastructure/repositories/PrismaManufacturerRepository";

const manufacturerRepo = new PrismaManufacturerRepository();

const getAllManufacturersUseCase = new GetAllManufacturersUseCase(
  manufacturerRepo,
);
export const createManufacturerUseCase = new CreateManufacturerUseCase(
  manufacturerRepo,
);
const getManufacturerByIdUseCase = new GetManufacturerByIdUseCase(
  manufacturerRepo,
);
const updateManufacturerUseCase = new UpdateManufacturerUseCase(
  manufacturerRepo,
);
const deleteManufacturerUseCase = new DeleteManufacturerUseCase(
  manufacturerRepo,
);

const manufacturerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export const getManufacturers = async (req: Request, res: Response) => {
  try {
    const { name, page, per_page } = req.query;
    const options: ManufacturerFilterOptions = {};
    if (typeof name === "string") options.name = String(name);
    if (typeof page === "string") options.page = Number(page);
    if (typeof per_page === "string") options.per_page = Number(per_page);

    const result = await getAllManufacturersUseCase.execute(
      Object.keys(options).length ? options : undefined,
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los fabricantes",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const createManufacturer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = manufacturerSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const { name } = parse.data;
    const manufacturer = await createManufacturerUseCase.execute({ name });
    res.status(201).json(manufacturer);
  } catch (error: unknown) {
    next(error);
  }
};

export const getManufacturerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de fabricante inválido" });
    }
    const manufacturer = await getManufacturerByIdUseCase.execute(Number(id));
    if (!manufacturer)
      return res.status(404).json({ error: "Fabricante no encontrado" });
    res.json(manufacturer);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al buscar el fabricante",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const updateManufacturer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de fabricante inválido" });
    }
    const parse = manufacturerSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const { name } = parse.data;
    const manufacturer = await updateManufacturerUseCase.execute(
      Number(id),
      name,
    );
    res.json(manufacturer);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteManufacturer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de fabricante inválido" });
    }
    await deleteManufacturerUseCase.execute(Number(id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
