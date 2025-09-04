import { Client } from '../entities/Client';

export interface ClientRepository {
    create(data: Omit<Client, 'id'>): Promise<Client>;
    findById(id: number): Promise<Client | null>;
    findAll(params?: { page?: number; per_page?: number; name?: string; phone?: string; clientType?: string }): Promise<{ data: Client[]; total: number; page: number; per_page: number }>;
    update(id: number, data: Partial<Omit<Client, 'id'>>): Promise<Client | null>;
    delete(id: number): Promise<void>;
}
