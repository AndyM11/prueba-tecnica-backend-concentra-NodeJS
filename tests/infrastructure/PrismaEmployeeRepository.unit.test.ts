import { PrismaEmployeeRepository } from '../../src/infrastructure/repositories/PrismaEmployeeRepository';
import { PrismaClient } from '@prisma/client';
import { Employee } from '../../src/domain/entities/Employee';
import { BloodType } from '../../src/domain/entities/Types';

describe('PrismaEmployeeRepository', () => {
    type MockEmpleado = {
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        findUnique: jest.Mock;
        findMany: jest.Mock;
        count: jest.Mock;
    };
    let prisma: { empleado: MockEmpleado };
    let repo: PrismaEmployeeRepository;

    beforeEach(() => {
        prisma = {
            empleado: {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
            },
        };
        repo = new PrismaEmployeeRepository(prisma as unknown as PrismaClient);
    });

    it('create retorna nuevo Employee', async () => {
        prisma.empleado.create.mockResolvedValue({
            id: 1,
            nombres: 'Juan',
            apellidos: 'Pérez',
            cedula: '123-1234567-1',
            telefono: '1234567890',
            tipoSangre: 'A+',
            email: 'juan@test.com',
        });
        const emp: Employee = {
            id: 1,
            firstName: 'Juan',
            lastName: 'Pérez',
            nationalId: '123-1234567-1',
            phone: '1234567890',
            bloodType: BloodType.A_POS,
            email: 'juan@test.com',
        };
        const result = await repo.create(emp);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('firstName', 'Juan');
        expect(result).toHaveProperty('bloodType', 'A+');
    });

    it('update retorna Employee actualizado', async () => {
        prisma.empleado.update.mockResolvedValue({
            id: 1,
            nombres: 'Juan',
            apellidos: 'Pérez',
            cedula: '123-1234567-1',
            telefono: '1234567890',
            tipoSangre: 'B-',
            email: 'juan@test.com',
        });
        const result = await repo.update(1, { bloodType: BloodType.B_NEG });
        expect(result).toHaveProperty('bloodType', 'B-');
    });

    it('update retorna null si no existe', async () => {
        prisma.empleado.update.mockResolvedValue(null);
        const result = await repo.update(999, { bloodType: BloodType.B_NEG });
        expect(result).toBeNull();
    });

    it('delete elimina Employee', async () => {
        prisma.empleado.delete.mockResolvedValue(undefined);
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });

    it('findById retorna Employee si existe', async () => {
        prisma.empleado.findUnique.mockResolvedValue({
            id: 1,
            nombres: 'Juan',
            apellidos: 'Pérez',
            cedula: '123-1234567-1',
            telefono: '1234567890',
            tipoSangre: 'A+',
            email: 'juan@test.com',
        });
        const result = await repo.findById(1);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('firstName', 'Juan');
    });

    it('findById retorna null si no existe', async () => {
        prisma.empleado.findUnique.mockResolvedValue(null);
        const result = await repo.findById(999);
        expect(result).toBeNull();
    });


    it('findByFilter retorna paginado', async () => {
        prisma.empleado.count.mockResolvedValue(1);
        prisma.empleado.findMany.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                cedula: '123-1234567-1',
                telefono: '1234567890',
                tipoSangre: 'A+',
                email: 'juan@test.com',
            },
        ]);
        const result = await repo.findByFilter({ firstName: 'Juan', page: 1, per_page: 1 });
        expect(result).toHaveProperty('total', 1);
        expect(result.data[0]).toHaveProperty('firstName', 'Juan');
    });

    it('findByFilter retorna vacío si no hay coincidencias', async () => {
        prisma.empleado.count.mockResolvedValue(0);
        prisma.empleado.findMany.mockResolvedValue([]);
        const result = await repo.findByFilter({ lastName: 'NoExiste', page: 1, per_page: 1 });
        expect(result.total).toBe(0);
        expect(result.data).toEqual([]);
    });

    it('findByFilter filtra por bloodType', async () => {
        prisma.empleado.count.mockResolvedValue(1);
        prisma.empleado.findMany.mockResolvedValue([
            {
                id: 2,
                nombres: 'Ana',
                apellidos: 'Gómez',
                cedula: '321-7654321-0',
                telefono: '9876543210',
                tipoSangre: 'O-',
                email: 'ana@test.com',
            },
        ]);
        const result = await repo.findByFilter({ bloodType: BloodType.O_NEG });
        expect(result.data[0]).toHaveProperty('bloodType', 'O-');
    });

    it('getAll retorna vacío si no hay empleados', async () => {
        prisma.empleado.findMany.mockResolvedValue([]);
        const result = await repo.getAll({});
        expect(result).toEqual([]);
    });
});
