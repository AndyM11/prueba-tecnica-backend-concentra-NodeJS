import { Manufacturer } from '../entities/Manufacturer';

export interface ManufacturerRepository {
    findAll(): Promise<Manufacturer[]>;
    findByFilter(options: {
        name?: string;
        page?: number;
        per_page?: number;
    }): Promise<{ total: number; data: Manufacturer[]; current_page: number; per_page: number; last_page: number }>;

    findById(id: number): Promise<Manufacturer | null>;
    create(name: string): Promise<Manufacturer>;
    update(id: number, name: string): Promise<Manufacturer>;
    delete(id: number): Promise<void>;
}
