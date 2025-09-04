import { Placement } from '../entities/Placement';

export interface PlacementRepository {
    findByFilter(options?: {
        articuloId?: number;
        ubicacionId?: number;
        nombreExhibido?: string;
        precio?: number;
        page?: number;
        per_page?: number;
    }): Promise<{
        total: number;
        data: Placement[];
        page: number;
        per_page: number;
    }>;
    findById(id: number): Promise<Placement | null>;
    create(data: Omit<Placement, 'id'>): Promise<Placement>;
    update(id: number, data: Partial<Omit<Placement, 'id'>>): Promise<Placement | null>;
    delete(id: number): Promise<void>;
}
