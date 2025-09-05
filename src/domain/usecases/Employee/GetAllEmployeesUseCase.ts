import { EmployeeRepository } from '../../repositories/EmployeeRepository';
import { BloodType } from '../../entities/Types';

export class GetAllEmployeesUseCase {
    constructor(private repo: EmployeeRepository) { }
    async execute(options?: {
        firstName?: string;
        lastName?: string;
        nationalId?: string;
        phone?: string;
        bloodType?: BloodType;
        email?: string;
        page?: number;
        per_page?: number;
    }) {
        return await this.repo.findByFilter(options);
    }
}
