import { Router } from 'express';
import {
    createBuy,
    updateBuy,
    deleteBuy,
    getBuyById,
    getAllBuys
} from '../controllers/buy.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Buys
 *   
 */

/**
 * @swagger
 * /api/v1/buy:
 *   post:
 *     summary: Crea una nueva compra
 *     tags: [Buys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyInputSchema'
 *           examples:
 *             ejemplo:
 *               value:
 *                 clientId: 0
 *                 placementId: 0
 *                 units: 0
 *     responses:
 *       201:
 *         description: Compra creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   id: 0
 *                   clientId: 0
 *                   placementId: 0
 *                   units: 0
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createBuy);

/**
 * @swagger
 * /api/v1/buy/{id}:
 *   put:
 *     summary: Actualiza una compra existente
 *     tags: [Buys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyInputSchema'
 *           examples:
 *             ejemplo:
 *               value:
 *                 clientId: 0
 *                 placementId: 0
 *                 units: 0
 *     responses:
 *       200:
 *         description: Compra actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   id: 0
 *                   clientId: 0
 *                   placementId: 0
 *                   units: 0
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Compra no encontrada
 */
router.put('/:id', updateBuy);

/**
 * @swagger
 * /api/v1/buy/{id}:
 *   delete:
 *     summary: Elimina una compra por ID
 *     tags: [Buys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra
 *     responses:
 *       204:
 *         description: Compra eliminada
 *       404:
 *         description: Compra no encontrada
 */
router.delete('/:id', deleteBuy);

/**
 * @swagger
 * /api/v1/buy/{id}:
 *   get:
 *     summary: Obtiene una compra por ID
 *     tags: [Buys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   id: 0
 *                   clientId: 0
 *                   placementId: 0
 *                   units: 0
 *       404:
 *         description: Compra no encontrada
 */
router.get('/:id', getBuyById);

/**
 * @swagger
 * /api/v1/buy:
 *   get:
 *     summary: Lista todas las compras (con filtros y paginación)
 *     tags: [Buys]
 *     parameters:
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por ID de cliente
 *       - in: query
 *         name: placementId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por ID de colocación
 *       - in: query
 *         name: units
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por cantidad de unidades
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
 *         description: Lista de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BuyOutputSchema'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   - id: 0
 *                     clientId: 0
 *                     placementId: 0
 *                     units: 0
 *                   - id: 0
 *                     clientId: 0
 *                     placementId: 0
 *                     units: 0
 */
router.get('/', getAllBuys);

export default router;
