import { Placement } from "../entities/Placement";

export interface PlacementRepository {
  findByFilter(options?: {
    articleId?: number;
    locationId?: number;
    displayName?: string;
    price?: number;
    page?: number;
    per_page?: number;
  }): Promise<{
    total: number;
    data: Placement[];
    page: number;
    per_page: number;
  }>;
  findById(id: number): Promise<Placement | null>;
  create(data: Omit<Placement, "id">): Promise<Placement>;
  update(
    id: number,
    data: Partial<Omit<Placement, "id">>,
  ): Promise<Placement | null>;
  delete(id: number): Promise<void>;
}
