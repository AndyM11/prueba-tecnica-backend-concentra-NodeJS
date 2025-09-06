import { Router } from "express";
import {
  getPlacements,
  createPlacement,
  getPlacementById,
  updatePlacement,
  deletePlacement,
} from "../controllers/placement.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/placement:
 *   get:
 *     tags:
 *       - Placements
 *     summary: Listar todas las colocaciones
 *     parameters:
 *       - name: articleId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: locationId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: displayName
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: price
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: per_page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de colocaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Placement'
 *       500:
 *         description: Error obteniendo colocaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.get("/", getPlacements);
/**
 * @swagger
 * /api/v1/placement:
 *   post:
 *     tags:
 *       - Placements
 *     summary: Crear colocación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlacementInput'
 *     responses:
 *       201:
 *         description: Colocación creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Placement'
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
 */
router.post("/", createPlacement);
/**
 * @swagger
 * /api/v1/placement/{id}:
 *   get:
 *     tags:
 *       - Placements
 *     summary: Obtener colocación por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Colocación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Placement'
 *       400:
 *         description: ID de colocación inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Colocación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error obteniendo colocación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.get("/:id", getPlacementById);
/**
 * @swagger
 * /api/v1/placement/{id}:
 *   put:
 *     tags:
 *       - Placements
 *     summary: Actualizar colocación
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
 *             $ref: '#/components/schemas/Placement'
 *     responses:
 *       200:
 *         description: Colocación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Placement'
 *       400:
 *         description: Datos inválidos o ID de colocación inválido
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
 *       404:
 *         description: Colocación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/:id", updatePlacement);
/**
 * @swagger
 * /api/v1/placement/{id}:
 *   delete:
 *     tags:
 *       - Placements
 *     summary: Eliminar colocación
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Colocación eliminada
 *       400:
 *         description: ID de colocación inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Colocación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/:id", deletePlacement);

export default router;
