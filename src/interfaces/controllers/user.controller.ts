import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserRole } from "../../domain/entities/Types";
import { CreateUserUseCase } from "../../domain/usecases/User/CreateUserUseCase";
import { DeleteUserUseCase } from "../../domain/usecases/User/DeleteUserUseCase";
import { GetAllUsersUseCase } from "../../domain/usecases/User/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../domain/usecases/User/GetUserByIdUseCase";
import { GetUserByUsernameUseCase } from "../../domain/usecases/User/GetUserByUsernameUseCase";
import { UpdateUserUseCase } from "../../domain/usecases/User/UpdateUserUseCase";
import redis from "../../infrastructure/redisClient";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

const prisma = new PrismaClient();
const userRepo = new PrismaUserRepository(prisma);
export const createUserUseCase = new CreateUserUseCase(userRepo);
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
export const updateUserUseCase = new UpdateUserUseCase(userRepo);
export const deleteUserUseCase = new DeleteUserUseCase(userRepo);
export const getUserByUsernameUseCase = new GetUserByUsernameUseCase(userRepo);
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await getUserByUsernameUseCase.execute(username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener el usuario",
        details: error instanceof Error ? error.message : error,
      });
  }
};

const userSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/,
      "La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 caracter especial",
    ),
  rol: z.nativeEnum(UserRole),
  employeeId: z.number().int().optional().nullable(),
});

export const getUsers = async (req: Request, res: Response) => {
  try {
    const cacheKey = "users:all";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const result = await getAllUsersUseCase.execute();
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los usuarios",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const cacheKey = `users:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const user = await getUserByIdUseCase.execute(id);
    if (user) {
      await redis.set(cacheKey, JSON.stringify(user), "EX", 60);
      res.json(user);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener el usuario",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parse = userSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.issues });
    }
    const user = await createUserUseCase.execute(parse.data);
    return res.status(201).json(user);
  } catch (error) {
    return next(error instanceof Error ? error : new Error(String(error)));
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const parse = userSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", detalles: parse.error.issues });
    }
    try {
      const user = await updateUserUseCase.execute(id, parse.data);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      return next(error instanceof Error ? error : new Error(String(error)));
    }
  } catch (error) {
    return next(error instanceof Error ? error : new Error(String(error)));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    try {
      await deleteUserUseCase.execute(id);
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error: unknown) {
      next(error);
    }
  } catch (error: unknown) {
    next(error);
  }
};
