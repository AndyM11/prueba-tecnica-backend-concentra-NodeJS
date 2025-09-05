import { CreateEmployeeUseCase } from '../../src/domain/usecases/Employee/CreateEmployeeUseCase';
import { UpdateEmployeeUseCase } from '../../src/domain/usecases/Employee/UpdateEmployeeUseCase';
import { DeleteEmployeeUseCase } from '../../src/domain/usecases/Employee/DeleteEmployeeUseCase';
import { GetEmployeeByIdUseCase } from '../../src/domain/usecases/Employee/GetEmployeeByIdUseCase';
import { GetAllEmployeesUseCase } from '../../src/domain/usecases/Employee/GetAllEmployeesUseCase';
import { Employee } from '../../src/domain/entities/Employee';
import { BloodType } from '../../src/domain/entities/Types';

describe('Employee UseCases', () => {
    const repoMock = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        findById: jest.fn().mockResolvedValue({ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' }),
        findByFilter: jest.fn().mockResolvedValue([{ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' }]),
    };

    it('should create an employee', async () => {
        const useCase = new CreateEmployeeUseCase(repoMock as any);
        repoMock.create.mockResolvedValue({ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: BloodType.A_POS, email: 'juan@test.com' });
        const result = await useCase.execute({ firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: BloodType.A_POS, email: 'juan@test.com' });
        expect(result).toEqual(expect.objectContaining({ firstName: 'Juan' }));
        expect(repoMock.create).toHaveBeenCalled();
    });

    it('should update an employee', async () => {
        const useCase = new UpdateEmployeeUseCase(repoMock as any);
        repoMock.update.mockResolvedValue({ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: BloodType.A_NEG, email: 'juan@test.com' });
        const result = await useCase.execute(1, { bloodType: BloodType.A_NEG });
        expect(result?.bloodType).toBe(BloodType.A_NEG);
        expect(repoMock.update).toHaveBeenCalled();
    });

    it('should delete an employee', async () => {
        const useCase = new DeleteEmployeeUseCase(repoMock as any);
        repoMock.delete.mockResolvedValue(undefined);
        await expect(useCase.execute(1)).resolves.toBeUndefined();
        expect(repoMock.delete).toHaveBeenCalled();
    });

    it('should get employee by id', async () => {
        const useCase = new GetEmployeeByIdUseCase(repoMock as any);
        repoMock.findById.mockResolvedValue({ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: BloodType.A_POS, email: 'juan@test.com' });
        const result = await useCase.execute(1);
        expect(result?.id).toBe(1);
        expect(repoMock.findById).toHaveBeenCalled();
    });

    it('should get all employees', async () => {
        const useCase = new GetAllEmployeesUseCase(repoMock as any);
        repoMock.findByFilter.mockResolvedValue([{ id: 1, firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: BloodType.A_POS, email: 'juan@test.com' }]);
        const result = await useCase.execute({});
        expect(Array.isArray(result)).toBe(true);
        expect(repoMock.findByFilter).toHaveBeenCalled();
    });
});
