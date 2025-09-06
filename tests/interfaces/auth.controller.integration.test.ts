import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../src/app';
const prisma = new PrismaClient();

describe('POST /api/v1/user/auth/login (integración)', () => {
    let userId: number;
    let employeeId: number;
    const username = 'testuser_login';
    const password = 'Test1234!@#';

    beforeAll(async () => {
        // Crea usuario y empleado relacionados usando los modelos correctos
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.usuario.create({
            data: {
                username,
                passwordHash,
                rol: 'USER',
                Empleado: {
                    create: {
                        nombres: 'Empleado Login',
                        apellidos: 'Test',
                        cedula: 'EMPLOGIN123',
                        telefono: '555-000-0000',
                        tipoSangre: 'O+',
                        email: 'empleado_login@email.com',
                    },
                },
            },
            include: { Empleado: true },
        });
        userId = user.id;
        employeeId = user.Empleado?.id ?? 0;
    });

    afterAll(async () => {
        // Limpia los datos de prueba
        await prisma.empleado.deleteMany({ where: { id: employeeId } });
        await prisma.usuario.deleteMany({ where: { id: userId } });
        await prisma.$disconnect();
    });

    it('debe loguear correctamente y devolver user, employee y token', async () => {
        const res = await request(app)
            .post('/api/v1/user/auth/login')
            .send({ username, password });
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.employee).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toBe(username);
        expect(res.body.employee.id).toBe(employeeId);
    });

    it('debe fallar con credenciales incorrectas', async () => {
        const res = await request(app)
            .post('/api/v1/user/auth/login')
            .send({ username, password: 'incorrecta123!' });
        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/Usuario o contraseña incorrectos/i);
    });

    it('debe fallar si falta el password', async () => {
        const res = await request(app)
            .post('/api/v1/user/auth/login')
            .send({ username });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('debe fallar si el password no cumple la política', async () => {
        const res = await request(app)
            .post('/api/v1/user/auth/login')
            .send({ username, password: 'short' });
        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });
});
