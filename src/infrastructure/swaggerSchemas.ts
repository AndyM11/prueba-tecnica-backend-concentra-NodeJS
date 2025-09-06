/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "usuario123"
 *         passwordHash:
 *           type: string
 *           description: "Hash de la contraseña"
 *         rol:
 *           type: string
 *           enum: [ADMIN, USER]
 *           example: "USER"
 *         employeeId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - rol
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           example: "usuario123"
 *         password:
 *           type: string
 *           minLength: 10
 *           description: |
 *             Contraseña con robustez mínima: longitud ≥ 10, al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 caracter especial.
 *           example: "Password123!"
 *         rol:
 *           type: string
 *           enum: [ADMIN, USER]
 *           example: "USER"
 *         employeeId:
 *           type: integer
 *           nullable: true
 *           example: 5
 */
// Esquema Swagger para Buy
const BuyInputSchema = {
  type: "object",
  required: ["clientId", "placementId", "units"],
  properties: {
    clientId: { type: "integer", example: 2 },
    placementId: { type: "integer", example: 3 },
    units: { type: "integer", example: 5 },
  },
};

const BuyOutputSchema = {
  type: "object",
  required: ["id", "clientId", "placementId", "units"],
  properties: {
    id: { type: "integer", example: 1 },
    clientId: { type: "integer", example: 2 },
    placementId: { type: "integer", example: 3 },
    units: { type: "integer", example: 5 },
  },
};

// Esquema Swagger para Employee
const EmployeeInputSchema = {
  type: "object",
  required: [
    "firstName",
    "lastName",
    "nationalId",
    "phone",
    "bloodType",
    "email",
  ],
  properties: {
    firstName: { type: "string", example: "Pedro" },
    lastName: { type: "string", example: "Gómez" },
    nationalId: {
      type: "string",
      example: "123-1234567-1",
      pattern: "^\\d{3}-\\d{7}-\\d{1}$",
      description: "Formato: 000-0000000-0",
    },
    phone: {
      type: "string",
      example: "809-123-4567",
      pattern: "^(809|829|849)-\\d{3}-\\d{4}$",
      description: "Formato: 809-000-0000, 829-000-0000 o 849-000-0000.",
    },
    bloodType: {
      type: "string",
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      example: "O+",
      description: "Tipo de sangre.",
    },
    email: {
      type: "string",
      format: "email",
      example: "pedro.gomez@email.com",
    },
  },
};

const EmployeeOutputSchema = {
  type: "object",
  required: [
    "id",
    "firstName",
    "lastName",
    "nationalId",
    "phone",
    "bloodType",
    "email",
  ],
  properties: {
    id: { type: "integer", example: 1 },
    firstName: { type: "string", example: "Pedro" },
    lastName: { type: "string", example: "Gómez" },
    nationalId: {
      type: "string",
      example: "123-1234567-1",
      pattern: "^\\d{3}-\\d{7}-\\d{1}$",
      description: "Formato: 000-0000000-0",
    },
    phone: {
      type: "string",
      example: "809-123-4567",
      pattern: "^(809|829|849)-\\d{3}-\\d{4}$",
      description: "Formato: 809-000-0000, 829-000-0000 o 849-000-0000.",
    },
    bloodType: {
      type: "string",
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      example: "O+",
      description: "Tipo de sangre.",
    },
    email: {
      type: "string",
      format: "email",
      example: "pedro.gomez@email.com",
    },
  },
};
// Esquema Swagger para Client

// Esquemas para Client
const ClientInputSchema = {
  type: "object",
  required: ["name", "phone", "clientType"],
  properties: {
    name: { type: "string", example: "Juan Pérez" },
    phone: {
      type: "string",
      example: "809-123-4567",
      pattern: "^(809|829|849)-\\d{3}-\\d{4}$",
      description:
        "Phone in format 809-000-0000, 829-000-0000 or 849-000-0000. Valid prefixes: 809, 829, 849.",
    },
    clientType: {
      type: "string",
      enum: ["regular", "vip"],
      example: "regular",
      description: "Client type: regular or vip",
    },
  },
};

const ClientOutputSchema = {
  type: "object",
  required: ["id", "name", "phone", "clientType"],
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", example: "Juan Pérez" },
    phone: {
      type: "string",
      example: "809-123-4567",
      pattern: "^(809|829|849)-\\d{3}-\\d{4}$",
      description:
        "Phone in format 809-000-0000, 829-000-0000 or 849-000-0000. Valid prefixes: 809, 829, 849.",
    },
    clientType: {
      type: "string",
      enum: ["regular", "vip"],
      example: "regular",
      description: "Client type: regular or vip",
    },
  },
};

const ClientListOutputSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: ClientOutputSchema,
    },
    total: { type: "integer", example: 100 },
    page: { type: "integer", example: 1 },
    per_page: { type: "integer", example: 10 },
  },
};

// Objeto swaggerSchemas único y ordenado
export const swaggerSchemas = {
  BuyInputSchema,
  BuyOutputSchema,
  EmployeeInputSchema,
  EmployeeOutputSchema,
  Article: {
    type: "object",
    description: "Artículo. Representa un producto almacenado en el sistema.",
    properties: {
      id: { type: "integer", description: "Identificador único del artículo" },
      codigoBarras: {
        type: "string",
        description: "Código de barras del artículo",
      },
      descripcion: { type: "string", description: "Descripción del artículo" },
      fabricanteId: {
        type: "integer",
        description: "Identificador del fabricante asociado",
      },
      stock: {
        type: "integer",
        description: "Cantidad disponible en inventario",
      },
    },
    required: ["codigoBarras", "fabricanteId"],
  },
  Manufacturer: {
    type: "object",
    properties: {
      id: { type: "integer" },
      nombre: { type: "string" },
    },
    required: ["nombre"],
  },
  Location: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
    },
    required: ["name"],
  },
  Placement: {
    type: "object",
    properties: {
      id: { type: "integer" },
      articleId: { type: "integer" },
      locationId: { type: "integer" },
      displayName: { type: "string" },
      price: { type: "number" },
    },
    required: ["articleId", "locationId", "displayName", "price"],
  },
  ClientInputSchema,
  ClientOutputSchema,
  ClientListOutputSchema,
};
