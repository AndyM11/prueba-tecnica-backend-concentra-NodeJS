import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/client:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Listar clientes (con filtro y paginación)
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by partial name (optional)
 *       - name: phone
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by partial phone (optional)
 *       - name: clientType
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [regular, vip]
 *         description: Filter by client type (optional)
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Página (opcional)
 *       - name: per_page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Cantidad por página (opcional)
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientListOutputSchema'
 */
router.get("/", getClients);

/**
 * @swagger
 * /api/v1/client/{id}:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Obtener cliente por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientOutputSchema'
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", getClientById);

/**
 * @swagger
 * /api/v1/client:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Crear cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInputSchema'
 *           example:
 *             name: string
 *             phone: string
 *             clientType: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientOutputSchema'
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createClient);

/**
 * @swagger
 * /api/v1/client/{id}:
 *   put:
 *     tags:
 *       - Clients
 *     summary: Actualizar cliente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInputSchema'
 *           example:
 *             name: string
 *             phone: string
 *             clientType: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientOutputSchema'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", updateClient);

/**
 * @swagger
 * /api/v1/client/{id}:
 *   delete:
 *     tags:
 *       - Clients
 *     summary: Eliminar cliente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       204:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", deleteClient);

export default router;
