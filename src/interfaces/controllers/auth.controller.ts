import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaEmployeeRepository } from "../../infrastructure/repositories/PrismaEmployeeRepository";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
// Esquema y tipo para login
export const loginSchema = z.object({
    username: z.string().min(3, "El usuario es requerido"),
    password: z
        .string()
        .min(10, "La contraseña debe tener al menos 10 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/,
            "La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 caracter especial",
        ),
});
export type LoginDto = z.infer<typeof loginSchema>;

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const employeeRepository = new PrismaEmployeeRepository(prisma);

import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || ''; // Asegurarse de que JWT_SECRET es una cadena

export async function login(req: Request, res: Response) {
    try {
        // Validar solo username primero
        const username = req.body.username;
        if (!username || typeof username !== 'string' || username.length < 3) {
            return res.status(400).json({ error: { fieldErrors: { username: ["El usuario es requerido"] } } });
        }
        const user = await userRepository.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        // Ahora validar password (política y match)
        const password = req.body.password;
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: { fieldErrors: { password: ["La contraseña es requerida"] } } });
        }
        // Validar política de password
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;
        if (!passwordPolicy.test(password)) {
            // Usuario existe pero password no cumple política: 401
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        let employee = null;
        if (user.employeeId) {
            employee = await employeeRepository.findById(user.employeeId);
        }
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                rol: user.rol,
                employeeId: user.employeeId ?? undefined,
            },
            JWT_SECRET,
            { expiresIn: "8h" }
        );
        return res.json({
            user: {
                id: user.id,
                username: user.username,
                rol: user.rol,
                employeeId: user.employeeId,
            },
            employee,
            token,
        });
    } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
