import { Router } from 'express';
import {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle
} from '../controllers/article.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/article:
 *   get:
 *     tags:
 *        - Articles
 *     summary: Listar artículos (con filtro y paginación)
 *     parameters:
 *       - name: descripcion
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por descripción parcial (opcional)
 *       - name: codigoBarras
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por código de barras parcial (opcional)
 *       - name: fabricanteId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del fabricante (opcional)
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - name: per_page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Results per page (optional)
 *     responses:
 *       200:
 *         description: Lista paginada de artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get('/', getArticles);

/**
 * @swagger
 * /api/v1/article/create:
 *   post:
 *     tags:
 *        - Articles
 *     summary: Crear artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Artículo creado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El artículo ya existe
 */
router.post('/create', createArticle);

/**
 * @swagger
 * /api/v1/article/getById/{id}:
 *   get:
 *     tags:
 *        - Articles
 *     summary: Obtener artículo por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/getById/:id', getArticleById);

/**
 * @swagger
 * /api/v1/article/update/{id}:
 *   put:
 *     tags:
 *        - Articles
 *     summary: Actualizar artículo
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
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Artículo actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/update/:id', updateArticle);

/**
 * @swagger
 * /api/v1/article/delete/{id}:
 *   delete:
 *     tags:
 *        - Articles
 *     summary: Eliminar artículo
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Artículo eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/delete/:id', deleteArticle);

export default router;
