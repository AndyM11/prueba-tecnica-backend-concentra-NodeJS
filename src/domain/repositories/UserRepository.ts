import { User } from "../entities/User";

export interface UserRepository {
    create(user: Omit<User, "id">): Promise<User>;
    findById(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: number, data: Partial<Omit<User, "id">>): Promise<User | null>;
    delete(id: number): Promise<void>;
    existsByUsername(username: string): Promise<boolean>;
}
