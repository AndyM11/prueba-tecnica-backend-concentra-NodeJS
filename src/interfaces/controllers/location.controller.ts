import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateLocationUseCase } from "../../domain/usecases/Location/CreateLocationUseCase";
import { DeleteLocationUseCase } from "../../domain/usecases/Location/DeleteLocationUseCase";
import { GetAllLocationsUseCase } from "../../domain/usecases/Location/GetAllLocationsUseCase";
import { GetLocationByIdUseCase } from "../../domain/usecases/Location/GetLocationByIdUseCase";
import { UpdateLocationUseCase } from "../../domain/usecases/Location/UpdateLocationUseCase";
import { PrismaLocationRepository } from "../../infrastructure/repositories/PrismaLocationRepository";

const locationRepo = new PrismaLocationRepository();
export const listLocationsUseCase = new GetAllLocationsUseCase(locationRepo);
export const createLocationUseCase = new CreateLocationUseCase(locationRepo);
export const getLocationByIdUseCase = new GetLocationByIdUseCase(locationRepo);
export const updateLocationUseCase = new UpdateLocationUseCase(locationRepo);
export const deleteLocationUseCase = new DeleteLocationUseCase(locationRepo);

const locationSchema = z.object({
  name: z.string().min(5, "El nombre es obligatorio"),
});

export const getLocations = async (req: Request, res: Response) => {
  try {
    const result = await listLocationsUseCase.execute();
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error obteniendo ubicaciones",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = locationSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const location = await createLocationUseCase.execute(parse.data);
    res.status(201).json(location);
  } catch (error: unknown) {
    next(error);
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de ubicación inválido" });
    }
    const location = await getLocationByIdUseCase.execute(Number(id));
    if (!location)
      return res.status(404).json({ error: "Ubicación no encontrada" });
    res.json(location);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error obteniendo ubicación",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de ubicación inválido" });
    }
    const parse = locationSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const location = await updateLocationUseCase.execute(
      Number(id),
      parse.data,
    );
    res.json(location);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de ubicación inválido" });
    }
    await deleteLocationUseCase.execute(Number(id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
