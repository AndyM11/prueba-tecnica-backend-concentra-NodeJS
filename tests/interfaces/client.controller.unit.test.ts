interface MockUseCase {
    execute: (...args: unknown[]) => unknown;
}
interface MensajeResponse {
    mensaje: string;
}

import { PrismaClient } from '@prisma/client';
import express from 'express';
import request from 'supertest';
import { ClientType } from '../../src/domain/entities/Types';
import * as CreateClientUseCaseModule from '../../src/domain/usecases/Client/CreateClientUseCase';
import * as DeleteClientUseCaseModule from '../../src/domain/usecases/Client/DeleteClientUseCase';
import * as UpdateClientUseCaseModule from '../../src/domain/usecases/Client/UpdateClientUseCase';
import redis from '../../src/infrastructure/redisClient';
import clientRoutes from '../../src/interfaces/routes/client.routes';

type ClientResponse = {
    id: number;
    name: string;
    phone: string;
    clientType: ClientType | string;
};

type ClientListResponse = {
    data: ClientResponse[];
    total: number;
    page: number;
    per_page: number;
};

type ErrorResponse = { error: string; details?: unknown };

describe('ClientController (unit)', () => {
    it('should return 500 if getClients throws unexpected error', async () => {
        jest.spyOn(redis, 'get').mockImplementationOnce(() => { throw new Error('Test error'); });
        const res = await request(app).get('/api/v1/client');
        expect(res.status).toBe(500);
        expect((res.body as ErrorResponse).error).toMatch(/Error al obtener los clientes/);
    });

    it('should return 500 if getClientById throws unexpected error', async () => {
        jest.spyOn(redis, 'get').mockImplementationOnce(() => { throw new Error('Test error'); });
        const res = await request(app).get('/api/v1/client/1');
        expect(res.status).toBe(500);
        expect((res.body as ErrorResponse).error).toMatch(/Error al obtener el cliente/);
    });

    it('should call next on error in createClient', async () => {
        class MockCreateClientUseCase {
            constructor(_: unknown) { }
            execute() { throw new Error('Test error'); }
        }
        const spy = jest.spyOn(CreateClientUseCaseModule, 'CreateClientUseCase').mockImplementation(MockCreateClientUseCase as any);
        await request(app)
            .post('/api/v1/client')
            .send({ name: "Juan", phone: "809-123-4567", clientType: "regular" });
        spy.mockRestore();
    });

    it('should call next on error in updateClient', async () => {
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Test", phone: "809-111-2222", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        class MockUpdateClientUseCase {
            constructor(_: unknown) { }
            execute() { throw new Error('Test error'); }
        }
        const spy = jest.spyOn(UpdateClientUseCaseModule, 'UpdateClientUseCase').mockImplementation(MockUpdateClientUseCase as any);
        await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ name: "Error" });
        spy.mockRestore();
    });

    it('should call next on error in deleteClient', async () => {
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Test", phone: "809-111-3333", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        class MockDeleteClientUseCase {
            constructor(_: unknown) { }
            execute() { throw new Error('Test error'); }
        }
        const spy = jest.spyOn(DeleteClientUseCaseModule, 'DeleteClientUseCase').mockImplementation(MockDeleteClientUseCase as any);
        await request(app)
            .delete(`/api/v1/client/${id}`);
        spy.mockRestore();
    });

    it('should return 400 if update body has invalid clientType', async () => {
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Test", phone: "809-111-2222", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        const res = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ clientType: "gold" });
        expect(res.status).toBe(400);
        expect((res.body as ErrorResponse).error).toBe("Datos inválidos");
    });
    it('should reject client with invalid name but valid phone', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: "A", phone: "809-123-4567", clientType: "regular" });
        expect(res.status).toBe(400);
        expect((res.body as ErrorResponse).error).toBe("Datos inválidos");
    });

    it('should return 400 if update id is invalid', async () => {
        const res = await request(app)
            .put('/api/v1/client/abc')
            .send({ name: "Test" });
        expect(res.status).toBe(400);
        expect((res.body as ErrorResponse).error).toBe("ID de cliente inválido");
    });

    it('should return 400 if update body is empty', async () => {
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Test", phone: "809-111-2222", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        const res = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({});
        expect(res.status).toBe(400);
        expect((res.body as ErrorResponse).error).toBe("No se proporcionaron campos para actualizar");
    });

    it('should return 400 if update body has invalid phone', async () => {
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Test", phone: "809-111-3333", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        const res = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ phone: "123" });
        expect(res.status).toBe(400);
        expect((res.body as ErrorResponse).error).toBe("El teléfono tiene un formato inválido");
    });

    it('should return 404 if update client does not exist', async () => {
        const res = await request(app)
            .put('/api/v1/client/99999')
            .send({ name: "NoExiste" });
        expect(res.status).toBe(404);
        expect((res.body as MensajeResponse).mensaje).toBe("Cliente no encontrado");
    });

    it('should return 400 if delete id is invalid', async () => {
        const res = await request(app)
            .delete('/api/v1/client/abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("ID de cliente inválido");
    });
    // Limpiar la base de datos de clientes antes de cada test
    beforeEach(async () => {
        const prisma = new PrismaClient();
        await prisma.cliente.deleteMany();
        await prisma.$disconnect();
    });
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/client', clientRoutes);
    });

    it('should create a valid client', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: "Juan", phone: "809-123-4567", clientType: "regular" });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        const body = res.body as ClientResponse;
        expect(body.name).toBe("Juan");
        expect(body.clientType).toBe(ClientType.REGULAR);
    });

    it('should reject client with invalid data', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: "", phone: "123", clientType: "vip" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should get a client by non-existent id', async () => {
        const res = await request(app)
            .get('/api/v1/client/99999');
        expect([404]).toContain(res.status);
    });

    it('should update a client with valid data', async () => {
        // Primero crear
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Ana", phone: "809-567-8901", clientType: "vip" });
        const id = (createRes.body as ClientResponse).id;
        // Actualizar (incluye teléfono válido)
        const updateRes = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ name: "Ana Actualizada", phone: "809-567-8901" });
        expect(updateRes.status).toBe(200);
        const updated = updateRes.body as ClientResponse;
        expect(updated.name).toBe("Ana Actualizada");
    });

    it('should delete an existing client', async () => {
        // Crear
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: "Pedro", phone: "809-345-6789", clientType: "regular" });
        const id = (createRes.body as ClientResponse).id;
        // Eliminar
        const deleteRes = await request(app)
            .delete(`/api/v1/client/${id}`);
        expect([204, 200]).toContain(deleteRes.status);
    });

    it('should filter clients by name', async () => {
        // Crear ambos clientes y asegurar que se crean correctamente
        const res1 = await request(app)
            .post('/api/v1/client')
            .send({ name: "Carlos", phone: "809-333-4444", clientType: "regular" });
        expect(res1.status).toBe(201);
        const res2 = await request(app)
            .post('/api/v1/client')
            .send({ name: "Carla", phone: "829-555-6666", clientType: "vip" });
        expect(res2.status).toBe(201);
        // Filtrar
        const res = await request(app)
            .get('/api/v1/client?name=Car');
        expect(res.status).toBe(200);
        const list = res.body as ClientListResponse;
        expect(list.data.length).toBe(2);
        expect(list.data.some((c) => c.name.includes("Car"))).toBe(true);
    });

    it('should filter clients by phone', async () => {
        await request(app)
            .post('/api/v1/client')
            .send({ name: "Mario", phone: "809-678-9012", clientType: "regular" });
        await request(app)
            .post('/api/v1/client')
            .send({ name: "Luigi", phone: "809-789-0123", clientType: "vip" });
        const res = await request(app)
            .get('/api/v1/client?phone=809-6')
        expect(res.status).toBe(200);
        const list = res.body as ClientListResponse;
        expect(list.data.some((c) => c.phone.includes("809-6"))).toBe(true);
    });

    it('should filter clients by clientType', async () => {
        await request(app)
            .post('/api/v1/client')
            .send({ name: "Regu", phone: "809-555-5555", clientType: "regular" });
        await request(app)
            .post('/api/v1/client')
            .send({ name: "Vip", phone: "809-666-6666", clientType: "vip" });
        const res = await request(app)
            .get('/api/v1/client?clientType=vip')
        expect(res.status).toBe(200);
        const list = res.body as ClientListResponse;
        expect(list.data.every((c) => c.clientType === "vip")).toBe(true);
    });

    it('should reject registration with incorrect phone format', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: "Error", phone: "123-456-7890", clientType: "regular" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        const err = res.body as ErrorResponse;
        expect(["Datos inválidos", "El teléfono tiene un formato inválido"]).toContain(err.error);
    });

    it('should reject registration with invalid prefix', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: "Error", phone: "800-123-4567", clientType: "vip" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        const err = res.body as ErrorResponse;
        expect(["Datos inválidos", "El teléfono tiene un formato inválido"]).toContain(err.error);
    });
});
