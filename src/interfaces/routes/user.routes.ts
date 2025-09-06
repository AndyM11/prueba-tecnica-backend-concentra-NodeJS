import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
} from "../controllers/user.controller";
import { login } from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/user/username/{username}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener usuario por username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 0
 *               username: "string"
 *               passwordHash: "string"
 *               rol: "USER"
 *               employeeId: 0
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/username/:username", getUserByUsername);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 0
 *                 username: "string"
 *                 passwordHash: "string"
 *                 rol: "USER"
 *                 employeeId: 0
 *               - id: 0
 *                 username: "string"
 *                 passwordHash: "string"
 *                 rol: "ADMIN"
 *                 employeeId: 0
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 0
 *               username: "string"
 *               passwordHash: "string"
 *               rol: "USER"
 *               employeeId: 0
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           example:
 *             username: "string"
 *             password: "string"
 *             rol: "USER"
 *             employeeId: 0
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 0
 *               username: "string"
 *               passwordHash: "string"
 *               rol: "USER"
 *               employeeId: 0
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 detalles:
 *                   type: array
 *                   items:
 *                     type: object
 *             examples:
 *               datosInvalidos:
 *                 value:
 *                   error: "Datos inválidos"
 *                   detalles: [ { path: ["password"], message: "La contraseña debe tener al menos 10 caracteres" } ]
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *             examples:
 *               usuarioNoEncontrado:
 *                 value:
 *                   mensaje: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 *             examples:
 *               errorInterno:
 *                 value:
 *                   error: "Error al obtener los usuarios"
 *                   details: "Error de conexión a base de datos"
 */
router.post("/", createUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar usuario
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
 *             $ref: '#/components/schemas/UserInput'
 *           example:
 *             username: "string"
 *             password: "string"
 *             rol: "USER"
 *             employeeId: 0
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 0
 *               username: "string"
 *               passwordHash: "string"
 *               rol: "USER"
 *               employeeId: 0
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Eliminar usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /api/v1/user/auth/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Iniciar sesión de usuario
 *     description: Valida usuario y contraseña, retorna datos del usuario, datos del empleado (si aplica) y un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "usuario1"
 *               password:
 *                 type: string
 *                 example: "contraseña123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 employee:
 *                   $ref: '#/components/schemas/Employee'
 *                 token:
 *                   type: string
 *             example:
 *               user:
 *                 id: 1
 *                 username: "usuario1"
 *                 rol: "ADMIN"
 *                 employeeId: 2
 *               employee:
 *                 id: 2
 *                 name: "Juan Pérez"
 *                 phone: "809-555-1234"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Datos inválidos (faltan campos requeridos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *             example:
 *               error:
 *                 fieldErrors:
 *                   username: ["El usuario es requerido"]
 *                   password: ["La contraseña es requerida"]
 *       401:
 *         description: Usuario o contraseña incorrectos, o contraseña no cumple política (si el usuario existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Usuario o contraseña incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Error interno del servidor"
 */
router.post("/auth/login", login);

export default router;
