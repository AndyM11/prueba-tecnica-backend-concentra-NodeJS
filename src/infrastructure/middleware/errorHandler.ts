import { Request, Response, NextFunction } from 'express';


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err.type === 'BARCODE_DUPLICATE') {
        return res.status(409).json({ error: 'El código de barras ya existe' });
    }

    if (err.code === 'P2003') {
        return res.status(400).json({ error: 'Violación de restricción de clave foránea: el fabricante no existe o es inválido', details: err.meta });
    }

    if (err.type === 'MANUFACTURER_NOT_FOUND') {
        return res.status(400).json({ error: 'El fabricante no existe' });
    }

    if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Registro duplicado', details: err.meta });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Registro no encontrado', details: err.meta });
    }

    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor', details: err });
}
