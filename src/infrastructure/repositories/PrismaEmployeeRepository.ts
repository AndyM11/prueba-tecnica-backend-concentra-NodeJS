import { Prisma, PrismaClient } from "@prisma/client";
import { Employee } from "../../domain/entities/Employee";
import { BloodType, EmployeeFilterOptions } from "../../domain/entities/Types";
import { EmployeeRepository } from "../../domain/repositories/EmployeeRepository";

export class PrismaEmployeeRepository implements EmployeeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(employee: Employee): Promise<Employee> {
    const created = await this.prisma.empleado.create({
      data: {
        id: employee.id,
        nombres: employee.firstName,
        apellidos: employee.lastName,
        cedula: employee.nationalId,
        telefono: employee.phone,
        tipoSangre: employee.bloodType,
        email: employee.email,
      },
    });
    return {
      id: created.id,
      firstName: created.nombres,
      lastName: created.apellidos,
      nationalId: created.cedula,
      phone: created.telefono,
      bloodType: created.tipoSangre as BloodType,
      email: created.email,
    };
  }

  async update(
    id: number,
    data: Partial<Omit<Employee, "id">>
  ): Promise<Employee | null> {
    const updated = await this.prisma.empleado.update({
      where: { id },
      data: {
        nombres: data.firstName,
        apellidos: data.lastName,
        cedula: data.nationalId,
        telefono: data.phone,
        tipoSangre: data.bloodType,
        email: data.email,
      },
    });
    return updated
      ? {
        id: updated.id,
        firstName: updated.nombres,
        lastName: updated.apellidos,
        nationalId: updated.cedula,
        phone: updated.telefono,
        bloodType: updated.tipoSangre as BloodType,
        email: updated.email,
      }
      : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.empleado.delete({ where: { id } });
  }

  async getById(id: number): Promise<Employee | null> {
    const found = await this.prisma.empleado.findUnique({ where: { id } });
    return found
      ? {
        id: found.id,
        firstName: found.nombres,
        lastName: found.apellidos,
        nationalId: found.cedula,
        phone: found.telefono,
        bloodType: found.tipoSangre as BloodType,
        email: found.email,
      }
      : null;
  }

  async getAll(filters: EmployeeFilterOptions): Promise<Employee[]> {
    const where: Prisma.EmpleadoWhereInput = {};
    if (filters.firstName) where.nombres = filters.firstName;
    if (filters.lastName) where.apellidos = filters.lastName;
    if (filters.bloodType) where.tipoSangre = filters.bloodType;
    if (filters.phone) where.telefono = filters.phone;
    if (filters.email) where.email = filters.email;
    const results = await this.prisma.empleado.findMany({ where });
    return results.map((r) => ({
      id: r.id,
      firstName: r.nombres,
      lastName: r.apellidos,
      nationalId: r.cedula,
      phone: r.telefono,
      bloodType: r.tipoSangre as BloodType,
      email: r.email,
    }));
  }

  async findById(id: number): Promise<Employee | null> {
    return this.getById(id);
  }

  async findByFilter(options?: {
    firstName?: string;
    lastName?: string;
    nationalId?: string;
    phone?: string;
    bloodType?: BloodType;
    email?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    data: Employee[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const where: Prisma.EmpleadoWhereInput = {};
    if (options?.firstName) where.nombres = options.firstName;
    if (options?.lastName) where.apellidos = options.lastName;
    if (options?.nationalId) where.cedula = options.nationalId;
    if (options?.phone) where.telefono = options.phone;
    if (options?.bloodType) where.tipoSangre = options.bloodType;
    if (options?.email) where.email = options.email;
    const page = options?.page ? Number(options.page) : 1;
    const per_page = options?.per_page ? Number(options.per_page) : 10;
    const skip = (page - 1) * per_page;
    const [results, total] = await Promise.all([
      this.prisma.empleado.findMany({ where, skip, take: per_page }),
      this.prisma.empleado.count({ where }),
    ]);
    return {
      data: results.map((r) => ({
        id: r.id,
        firstName: r.nombres,
        lastName: r.apellidos,
        nationalId: r.cedula,
        phone: r.telefono,
        bloodType: r.tipoSangre as BloodType,
        email: r.email,
      })),
      total,
      page,
      per_page,
    };
  }
}
