import { Router } from "express";
import {
  getManufacturers,
  createManufacturer,
  getManufacturerById,
  updateManufacturer,
  deleteManufacturer,
} from "../controllers/manufacturer.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/manufacturer:
 *   get:
 *     tags:
 *       - Manufacturers
 *     summary: Listar fabricantes (con filtro y paginación)
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por nombre parcial (opcional)
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Número de página (opcional)
 *       - name: per_page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página (opcional)
 *     responses:
 *       200:
 *         description: Lista paginada de fabricantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 per_page:
 *                   type: integer
 *                 current_page:
 *                   type: integer
 *                 last_page:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get("/", getManufacturers); //Para obtener todos los fabricantes.

/**
 * @swagger
 * /api/v1/manufacturer/create:
 *   post:
 *     tags:
 *       - Manufacturers
 *     summary: Crear fabricante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Fabricante creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *       409:
 *         description: El fabricante ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: object
 */
router.post("/create", createManufacturer);

/**
 * @swagger
 * /api/v1/manufacturer/getById/{id}:
 *   get:
 *     tags:
 *       - Manufacturers
 *     summary: Obtener fabricante por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fabricante encontrado
 *       404:
 *         description: No encontrado
 */
router.get("/getById/:id", getManufacturerById);

/**
 * @swagger
 * /api/v1/manufacturer/update/{id}:
 *   put:
 *     tags:
 *       - Manufacturers
 *     summary: Actualizar fabricante
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Fabricante actualizado
 *       404:
 *         description: No encontrado
 */
router.put("/update/:id", updateManufacturer);

/**
 * @swagger
 * /api/v1/manufacturer/delete/{id}:
 *   delete:
 *     tags:
 *       - Manufacturers
 *     summary: Eliminar fabricante
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Fabricante eliminado
 *       404:
 *         description: No encontrado
 */
router.delete("/delete/:id", deleteManufacturer);

export default router;
