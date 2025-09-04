// Esquema Swagger para Client

// Esquemas para Client
const ClientInputSchema = {
    type: 'object',
    required: ['name', 'phone', 'clientType'],
    properties: {
        name: { type: 'string', example: 'Juan Pérez' },
        phone: {
            type: 'string',
            example: '809-123-4567',
            pattern: '^(809|829|849)-\\d{3}-\\d{4}$',
            description: 'Phone in format 809-000-0000, 829-000-0000 or 849-000-0000. Valid prefixes: 809, 829, 849.'
        },
        clientType: {
            type: 'string',
            enum: ['regular', 'vip'],
            example: 'regular',
            description: 'Client type: regular or vip'
        }
    }
};

const ClientOutputSchema = {
    type: 'object',
    required: ['id', 'name', 'phone', 'clientType'],
    properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Juan Pérez' },
        phone: {
            type: 'string',
            example: '809-123-4567',
            pattern: '^(809|829|849)-\\d{3}-\\d{4}$',
            description: 'Phone in format 809-000-0000, 829-000-0000 or 849-000-0000. Valid prefixes: 809, 829, 849.'
        },
        clientType: {
            type: 'string',
            enum: ['regular', 'vip'],
            example: 'regular',
            description: 'Client type: regular or vip'
        }
    }
};

const ClientListOutputSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: ClientOutputSchema
        },
        total: { type: 'integer', example: 100 },
        page: { type: 'integer', example: 1 },
        per_page: { type: 'integer', example: 10 }
    }
};

// Objeto swaggerSchemas único y ordenado
export const swaggerSchemas = {
    Article: {
        type: 'object',
        description: 'Artículo. Representa un producto almacenado en el sistema.',
        properties: {
            id: { type: 'integer', description: 'Identificador único del artículo' },
            codigoBarras: { type: 'string', description: 'Código de barras del artículo' },
            descripcion: { type: 'string', description: 'Descripción del artículo' },
            fabricanteId: { type: 'integer', description: 'Identificador del fabricante asociado' },
            stock: { type: 'integer', description: 'Cantidad disponible en inventario' }
        },
        required: ['codigoBarras', 'fabricanteId']
    },
    Manufacturer: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' }
        },
        required: ['nombre']
    },
    Location: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
        },
        required: ['name']
    },
    Placement: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            articuloId: { type: 'integer' },
            ubicacionId: { type: 'integer' },
            nombreExhibido: { type: 'string' },
            precio: { type: 'number' }
        },
        required: ['articuloId', 'ubicacionId', 'nombreExhibido', 'precio']
    },
    ClientInputSchema,
    ClientOutputSchema,
    ClientListOutputSchema,
};
