export const swaggerSchemas = {
    Article: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            barcode: { type: 'string' },
            description: { type: 'string' },
            manufacturerId: { type: 'integer' },
            stock: { type: 'integer' }
        },
        required: ['barcode', 'manufacturerId']
    },
    Manufacturer: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' }
        },
        required: ['nombre']
    }
};
