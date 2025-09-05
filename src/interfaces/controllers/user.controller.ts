import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { CreateUserUseCase } from '../../domain/usecases/User/CreateUserUseCase';
import { GetUserByIdUseCase } from '../../domain/usecases/User/GetUserByIdUseCase';
import { GetAllUsersUseCase } from '../../domain/usecases/User/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../domain/usecases/User/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../domain/usecases/User/DeleteUserUseCase';
import { GetUserByUsernameUseCase } from '../../domain/usecases/User/GetUserByUsernameUseCase';
import { UserRole } from '../../domain/entities/Types';
import { Request, Response } from 'express';
import { z } from 'zod';

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
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario', details: error instanceof Error ? error.message : error });
    }
};

const userSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string()
        .min(10, 'La contraseña debe tener al menos 10 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/, 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 caracter especial'),
    rol: z.nativeEnum(UserRole),
    employeeId: z.number().int().optional().nullable(),
});

export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await getAllUsersUseCase.execute();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error instanceof Error ? error.message : error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await getUserByIdUseCase.execute(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario', details: error instanceof Error ? error.message : error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const parse = userSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', detalles: parse.error.issues });
        }
        const user = await createUserUseCase.execute(parse.data);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const parse = userSchema.partial().safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', detalles: parse.error.issues });
        }
        const user = await updateUserUseCase.execute(id, parse.data);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        try {
            await deleteUserUseCase.execute(id);
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario', details: error instanceof Error ? error.message : error });
    }
};
