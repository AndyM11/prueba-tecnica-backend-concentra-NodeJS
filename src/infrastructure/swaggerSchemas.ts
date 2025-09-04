export const swaggerSchemas = {
    ArticleInput: {
        type: 'object',
        description: 'Datos requeridos para crear un artículo.',
        properties: {
            codigoBarras: { type: 'string', description: 'Código de barras del artículo' },
            descripcion: { type: 'string', description: 'Descripción del artículo' },
            fabricanteId: { type: 'integer', description: 'Identificador del fabricante asociado' },
            stock: { type: 'integer', description: 'Cantidad disponible en inventario' }
        },
        required: ['codigoBarras', 'fabricanteId']
    },
    PlacementInput: {
        type: 'object',
        description: 'Datos requeridos para crear una colocación.',
        properties: {
            articuloId: { type: 'integer', description: 'ID del artículo relacionado' },
            ubicacionId: { type: 'integer', description: 'ID de la ubicación relacionada' },
            nombreExhibido: { type: 'string', description: 'Nombre exhibido en la colocación' },
            precio: { type: 'number', description: 'Precio de la colocación' }
        },
        required: ['articuloId', 'ubicacionId', 'nombreExhibido', 'precio']
    },
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
    }
};
