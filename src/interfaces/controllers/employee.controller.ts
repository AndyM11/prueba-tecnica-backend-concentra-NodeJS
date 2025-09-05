import { Request, Response } from 'express';
import { PrismaEmployeeRepository } from '../../infrastructure/repositories/PrismaEmployeeRepository';
import { PrismaClient } from '@prisma/client';
import { CreateEmployeeUseCase } from '../../domain/usecases/Employee/CreateEmployeeUseCase';
import { UpdateEmployeeUseCase } from '../../domain/usecases/Employee/UpdateEmployeeUseCase';
import { DeleteEmployeeUseCase } from '../../domain/usecases/Employee/DeleteEmployeeUseCase';
import { GetEmployeeByIdUseCase } from '../../domain/usecases/Employee/GetEmployeeByIdUseCase';
import { GetAllEmployeesUseCase } from '../../domain/usecases/Employee/GetAllEmployeesUseCase';
import { z } from 'zod';
import { BloodType } from '../../domain/entities/Types';

const employeeRepo = new PrismaEmployeeRepository(new PrismaClient());
const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepo);
const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepo);
const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepo);
const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepo);
const getAllEmployeesUseCase = new GetAllEmployeesUseCase(employeeRepo);

const employeeSchema = z.object({
    firstName: z.string().min(2, 'El nombre es obligatorio'),
    lastName: z.string().min(2, 'El apellido es obligatorio'),
    nationalId: z.string()
        .regex(/^\d{3}-\d{7}-\d{1}$/, 'La cédula debe tener el formato 000-0000000-0'),
    phone: z.string().min(10, 'El teléfono es obligatorio'),
    bloodType: z.string(),
    email: z.string().email('Email inválido'),
});

export const createEmployee = async (req: Request, res: Response, next: Function) => {
    try {
        const parse = employeeSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        // Convertir bloodType a enum
        const data = {
            ...parse.data,
            bloodType: BloodType[Object.keys(BloodType).find(key => BloodType[key as keyof typeof BloodType] === parse.data.bloodType) as keyof typeof BloodType] ?? parse.data.bloodType
        };
        const result = await createEmployeeUseCase.execute(data);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req: Request, res: Response, next: Function) => {
    try {
        const parse = employeeSchema.partial().safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        // Validar bloodType si existe
        // Construir data sin bloodType y agregarlo solo si es válido
        const { bloodType, ...rest } = parse.data;
        let data: Partial<Omit<import('../../domain/entities/Employee').Employee, 'id'>> = { ...rest };
        if (bloodType !== undefined) {
            const foundKey = Object.keys(BloodType).find(key => BloodType[key as keyof typeof BloodType] === bloodType);
            if (!foundKey) {
                return res.status(400).json({ error: 'Tipo de sangre inválido', details: [{ path: ['bloodType'], message: 'Debe ser un tipo válido' }] });
            }
            data.bloodType = BloodType[foundKey as keyof typeof BloodType];
        }
        const result = await updateEmployeeUseCase.execute(Number(req.params.id), data);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req: Request, res: Response, next: Function) => {
    try {
        await deleteEmployeeUseCase.execute(Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    const result = await getEmployeeByIdUseCase.execute(Number(req.params.id));
    if (!result) return res.status(404).send();
    res.json(result);
};

export const getAllEmployees = async (req: Request, res: Response) => {
    const result = await getAllEmployeesUseCase.execute(req.query);
    res.json(result);
};
