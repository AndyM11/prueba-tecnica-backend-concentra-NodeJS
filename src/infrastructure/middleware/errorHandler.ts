
import { Request, Response, NextFunction } from "express";
import { isPrismaErrorWithCode } from "../../interfaces/controllers/utils/errorGuards";

function hasErrorType(err: unknown, type: string): err is { type: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as Record<string, unknown>)["type"] === type
  );
}

function hasStatusAndMessage(err: unknown): err is { status: number; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as Record<string, unknown>)["status"] === "number" &&
    "message" in err &&
    typeof (err as Record<string, unknown>)["message"] === "string"
  );
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (hasErrorType(err, "BARCODE_DUPLICATE")) {
    return res.status(409).json({ error: "El código de barras ya existe" });
  }

  if (isPrismaErrorWithCode(err, "P2003")) {
    return res.status(400).json({
      error: "Violación de restricción de clave foránea: el fabricante no existe o es inválido",
      details: err.meta,
    });
  }

  if (hasErrorType(err, "MANUFACTURER_NOT_FOUND")) {
    return res.status(400).json({ error: "El fabricante no existe" });
  }

  if (isPrismaErrorWithCode(err, "P2002")) {
    return res.status(409).json({ error: "Registro duplicado", details: err.meta });
  }

  if (isPrismaErrorWithCode(err, "P2025")) {
    return res.status(404).json({ error: "Registro no encontrado", details: err.meta });
  }

  if (hasStatusAndMessage(err)) {
    return res.status(err.status).json({ error: err.message, details: err });
  }

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: "Error interno del servidor" });
}
