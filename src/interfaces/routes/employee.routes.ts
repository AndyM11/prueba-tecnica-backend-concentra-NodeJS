import { Router } from "express";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getAllEmployees,
} from "../controllers/employee.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *
 */

/**
 * @swagger
 * /api/v1/employee:
 *   post:
 *     summary: Crear un empleado
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInputSchema'
 *           examples:
 *             ejemplo:
 *               value:
 *                 bloodType: string
 *                 email: string
 *                 firstName: string
 *                 lastName: string
 *                 nationalId: string
 *                 phone: string
 *     responses:
 *       201:
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   bloodType: string
 *                   email: string
 *                   firstName: string
 *                   id: 0
 *                   lastName: string
 *                   nationalId: string
 *                   phone: string
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createEmployee);

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   put:
 *     summary: Actualizar un empleado
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInputSchema'
 *           examples:
 *             ejemplo:
 *               value:
 *                 bloodType: string
 *                 email: string
 *                 firstName: string
 *                 lastName: string
 *                 nationalId: string
 *                 phone: string
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   bloodType: string
 *                   email: string
 *                   firstName: string
 *                   id: 0
 *                   lastName: string
 *                   nationalId: string
 *                   phone: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Empleado no encontrado
 */
router.put("/:id", updateEmployee);

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   delete:
 *     summary: Eliminar un empleado
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       204:
 *         description: Empleado eliminado
 *       404:
 *         description: Empleado no encontrado
 */
router.delete("/:id", deleteEmployee);

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   id: 0
 *                   firstName: string
 *                   lastName: string
 *                   nationalId: string
 *                   phone: string
 *                   bloodType: string
 *                   email: string
 *       404:
 *         description: Empleado no encontrado
 */
router.get("/:id", getEmployeeById);

/**
 * @swagger
 * /api/v1/employee:
 *   get:
 *     summary: Listar todos los empleados
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por nombre
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por apellido
 *       - in: query
 *         name: nationalId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por cédula
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por teléfono
 *       - in: query
 *         name: bloodType
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por tipo de sangre
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Página de resultados (paginación)
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad de resultados por página (paginación)
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmployeeOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   - bloodType: string
 *                     email: string
 *                     firstName: string
 *                     id: 0
 *                     lastName: string
 *                     nationalId: string
 *                     phone: string
 *                   - bloodType: string
 *                     email: string
 *                     firstName: string
 *                     id: 0
 *                     lastName: string
 *                     nationalId: string
 *                     phone: string
 */
router.get("/", getAllEmployees);

export default router;
