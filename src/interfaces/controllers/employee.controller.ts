import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BloodType } from "../../domain/entities/Types";
import { Employee } from "../../domain/entities/Employee";
import { CreateEmployeeUseCase } from "../../domain/usecases/Employee/CreateEmployeeUseCase";
import { DeleteEmployeeUseCase } from "../../domain/usecases/Employee/DeleteEmployeeUseCase";
import { GetAllEmployeesUseCase } from "../../domain/usecases/Employee/GetAllEmployeesUseCase";
import { GetEmployeeByIdUseCase } from "../../domain/usecases/Employee/GetEmployeeByIdUseCase";
import { UpdateEmployeeUseCase } from "../../domain/usecases/Employee/UpdateEmployeeUseCase";
import { PrismaEmployeeRepository } from "../../infrastructure/repositories/PrismaEmployeeRepository";

const employeeRepo = new PrismaEmployeeRepository(new PrismaClient());
const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepo);
const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepo);
const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepo);
const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepo);
const getAllEmployeesUseCase = new GetAllEmployeesUseCase(employeeRepo);

const employeeSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  nationalId: z
    .string()
    .regex(
      /^\d{3}-\d{7}-\d{1}$/,
      "La cédula debe tener el formato 000-0000000-0",
    ),
  phone: z.string().min(10, "El teléfono es obligatorio"),
  bloodType: z.string(),
  email: z.string().email("Email inválido"),
});

export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = employeeSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    // Validar que el bloodType es un valor válido del enum
    if (!Object.values(BloodType).includes(parse.data.bloodType as BloodType)) {
      return res.status(400).json({ error: "Tipo de sangre inválido" });
    }
    const data = { ...parse.data, bloodType: parse.data.bloodType as BloodType }; // convertir a BloodType el dato para el repositorio
    const result = await createEmployeeUseCase.execute(data);
    res.status(201).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = employeeSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    // Validar bloodType si existe
    // Construir data sin bloodType y agregarlo solo si es válido
    const { bloodType, ...rest } = parse.data;
    let data: Partial<Omit<Employee, "id">> = { ...rest };
    if (bloodType !== undefined) {
      // Validar que bloodType es un valor válido del enum
      if (!Object.values(BloodType).includes(bloodType as BloodType)) {
        return res.status(400).json({
          error: "Tipo de sangre inválido",
          details: [
            { path: ["bloodType"], message: "Debe ser un tipo válido" },
          ],
        });
      }
      data.bloodType = bloodType as BloodType;
    }
    const result = await updateEmployeeUseCase.execute(
      Number(req.params.id),
      data,
    );
    res.json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteEmployeeUseCase.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const result = await getEmployeeByIdUseCase.execute(Number(req.params.id));
  if (!result) return res.status(404).send();
  res.json(result);
};

export const getAllEmployees = async (req: Request, res: Response) => {
  const result = await getAllEmployeesUseCase.execute(req.query);
  res.json(result);
};
