import { Buy } from "../entities/Buy";

export interface BuyRepository {
  findByFilter(options?: {
    clientId?: number;
    placementId?: number;
    units?: number;
    page?: number;
    per_page?: number;
  }): Promise<{ data: Buy[]; total: number; page: number; per_page: number }>;
  findById(id: number): Promise<Buy | null>;
  create(data: Omit<Buy, "id">): Promise<Buy>;
  update(id: number, data: Partial<Omit<Buy, "id">>): Promise<Buy | null>;
  delete(id: number): Promise<void>;
}
