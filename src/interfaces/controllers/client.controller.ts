
import { PrismaClientRepository } from '../../infrastructure/repositories/PrismaClientRepository';
import { CreateClientUseCase } from '../../domain/usecases/Client/CreateClientUseCase';
import { GetClientUseCase } from '../../domain/usecases/Client/GetClientUseCase';
import { GetAllClientsUseCase } from '../../domain/usecases/Client/GetAllClientsUseCase';
import { UpdateClientUseCase } from '../../domain/usecases/Client/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../domain/usecases/Client/DeleteClientUseCase';
import { ClientType } from '../../domain/entities/ClientType';
import { Client } from '../../domain/entities/Client';
import { Request, Response } from 'express';
import { z } from 'zod';

const clientRepo = new PrismaClientRepository();
export const createClientUseCase = new CreateClientUseCase(clientRepo);
export const getClientUseCase = new GetClientUseCase(clientRepo);
export const getAllClientsUseCase = new GetAllClientsUseCase(clientRepo);
export const updateClientUseCase = new UpdateClientUseCase(clientRepo);
export const deleteClientUseCase = new DeleteClientUseCase(clientRepo);

export const getClients = async (req: Request, res: Response) => {
    try {
        const { name, phone, clientType, page, per_page } = req.query;
        const options: any = {};
        if (name) options.name = String(name);
        if (phone) options.phone = String(phone);
        if (clientType) options.clientType = String(clientType);
        if (page) options.page = Number(page);
        if (per_page) options.per_page = Number(per_page);
        const result = await getAllClientsUseCase.execute(Object.keys(options).length ? options : undefined);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los clientes', details: error instanceof Error ? error.message : error });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const client = await getClientUseCase.execute(id);
        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: error instanceof Error ? error.message : error });
    }
};


const telefonoRegex = /^(809|829|849)-\d{3}-\d{4}$/;
const clientSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z.string().regex(telefonoRegex, 'El teléfono debe tener el formato 809-000-0000, 829-000-0000 o 849-000-0000'),
    clientType: z.enum(['regular', 'vip'])
});

export const createClient = async (req: Request, res: Response, next: Function) => {
    try {
        const parse = clientSchema.safeParse(req.body);
        if (!parse.success) {
            const telefonoError = parse.error.issues.find(issue => issue.path.includes('telefono'));
            if (telefonoError) {
                return res.status(400).json({ error: 'El teléfono tiene un formato inválido', details: parse.error.issues });
            }
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        // Pasar los datos en inglés directamente
        const data = {
            name: parse.data.name,
            phone: parse.data.phone,
            clientType: parse.data.clientType === 'vip' ? ClientType.VIP : ClientType.REGULAR
        };
        const client = await createClientUseCase.execute(data);
        res.status(201).json(client);
    } catch (error: any) {
        next(error);
    }
};

export const updateClient = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID de cliente inválido' });
        }
        const parse = clientSchema.partial().safeParse(req.body);
        if (!parse.success) {
            // Si solo se envía un campo, puede que no haya error de formato
            const telefonoError = parse.error.issues.find(issue => issue.path.includes('phone'));
            if (telefonoError) {
                return res.status(400).json({ error: 'El teléfono tiene un formato inválido', details: parse.error.issues });
            }
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        // Pasar los datos en inglés directamente
        const data: Partial<Omit<Client, 'id'>> = {};
        if (typeof parse.data.name !== 'undefined') data.name = parse.data.name;
        if (typeof parse.data.phone !== 'undefined') data.phone = parse.data.phone;
        if (typeof parse.data.clientType !== 'undefined') {
            data.clientType = parse.data.clientType === 'vip' ? ClientType.VIP : ClientType.REGULAR;
        }
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        const client = await updateClientUseCase.execute(Number(id), data);
        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
    } catch (error: any) {
        next(error);
    }
};

export const deleteClient = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID de cliente inválido' });
        }
        await deleteClientUseCase.execute(Number(id));
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};
