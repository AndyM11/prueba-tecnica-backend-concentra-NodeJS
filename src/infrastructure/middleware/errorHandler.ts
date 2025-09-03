import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err.type === 'BARCODE_DUPLICATE') {
        return res.status(409).json({ error: 'Barcode already exists' });
    }
    if (err.code === 'P2003') {
        return res.status(400).json({ error: 'Foreign key constraint violated: manufacturer does not exist or is invalid', details: err.meta });
    }
    if (err.type === 'MANUFACTURER_NOT_FOUND') {
        return res.status(400).json({ error: 'Manufacturer does not exist' });
    }
    if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Registro duplicado', details: err.meta });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Registro no encontrado', details: err.meta });
    }
    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor', details: err });
}
