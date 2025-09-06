import { UserRole } from "./Types";

export class User {
  constructor(
    public id: number,
    public username: string,
    public passwordHash: string,
    public rol: UserRole,
    public employeeId?: number | null,
  ) {}
}
