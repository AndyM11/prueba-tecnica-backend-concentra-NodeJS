import { BloodType } from "./Types";

export class Employee {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public nationalId: string,
    public phone: string,
    public bloodType: BloodType,
    public email: string,
  ) {}
}
