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
 *       - Articles
 *     summary: List articles (with filter and pagination)
 *     parameters:
 *       - name: description
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by partial description (optional)
 *       - name: barcode
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by partial barcode (optional)
 *       - name: manufacturerId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Manufacturer ID (optional)
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
 *         description: Paginated list of articles
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
 *       - Articles
 *     summary: Create article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article created
 *       400:
 *         description: Invalid data
 *       409:
 *         description: Article already exists
 */
router.post('/create', createArticle);

/**
 * @swagger
 * /api/v1/article/getById/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get article by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article found
 *       404:
 *         description: Not found
 */
router.get('/getById/:id', getArticleById);

/**
 * @swagger
 * /api/v1/article/update/{id}:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Update article
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
 *         description: Article updated
 *       404:
 *         description: Not found
 */
router.put('/update/:id', updateArticle);

/**
 * @swagger
 * /api/v1/article/delete/{id}:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Delete article
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Article deleted
 *       404:
 *         description: Not found
 */
router.delete('/delete/:id', deleteArticle);

export default router;
