"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // 1. Fabricantes
    const fabricantes = await prisma.fabricante.createMany({
        data: [
            { nombre: 'Acme Corp' },
            { nombre: 'Globex S.A.' },
            { nombre: 'Innova Ltda.' },
        ],
        skipDuplicates: true,
    });
    // 2. Artículos
    const fabricanteList = await prisma.fabricante.findMany();
    const articulos = await prisma.articulo.createMany({
        data: [
            { codigoBarras: '1234567890123', descripcion: 'Camisa básica', fabricanteId: fabricanteList[0].id, stock: 100 },
            { codigoBarras: '9876543210987', descripcion: 'Pantalón clásico', fabricanteId: fabricanteList[1].id, stock: 50 },
            { codigoBarras: '5555555555555', descripcion: 'Zapatos deportivos', fabricanteId: fabricanteList[2].id, stock: 30 },
        ],
        skipDuplicates: true,
    });
    // 3. Ubicaciones
    const ubicaciones = await prisma.ubicacion.createMany({
        data: [
            { nombre: 'Góndola A1' },
            { nombre: 'Isla Caja' },
            { nombre: 'Vitrina Central' },
        ],
        skipDuplicates: true,
    });
    // 4. Colocaciones
    const articuloList = await prisma.articulo.findMany();
    const ubicacionList = await prisma.ubicacion.findMany();
    const colocaciones = await prisma.colocacion.createMany({
        data: [
            { articuloId: articuloList[0].id, ubicacionId: ubicacionList[0].id, nombreExhibido: 'Camisa Oferta', precio: 499.99 },
            { articuloId: articuloList[1].id, ubicacionId: ubicacionList[1].id, nombreExhibido: 'Pantalón Premium', precio: 899.50 },
            { articuloId: articuloList[2].id, ubicacionId: ubicacionList[2].id, nombreExhibido: 'Zapatillas Running', precio: 1200.00 },
        ],
        skipDuplicates: true,
    });
    // 5. Clientes
    const clientes = await prisma.cliente.createMany({
        data: [
            { nombre: 'Juan Pérez', telefono: '809-123-4567', tipoCliente: 'regular' },
            { nombre: 'Ana Gómez', telefono: '829-555-1234', tipoCliente: 'vip' },
            { nombre: 'Carlos Ruiz', telefono: '849-777-8888', tipoCliente: 'regular' },
        ],
        skipDuplicates: true,
    });
    // 6. Compras
    const clienteList = await prisma.cliente.findMany();
    const colocacionList = await prisma.colocacion.findMany();
    await prisma.compra.createMany({
        data: [
            { clienteId: clienteList[0].id, colocacionId: colocacionList[0].id, unidades: 2 },
            { clienteId: clienteList[1].id, colocacionId: colocacionList[1].id, unidades: 1 },
            { clienteId: clienteList[2].id, colocacionId: colocacionList[2].id, unidades: 3 },
        ],
        skipDuplicates: true,
    });
    // 7. Empleados
    const empleados = await prisma.empleado.createMany({
        data: [
            { nombres: 'Pedro', apellidos: 'Gómez', cedula: '001-1234567-1', telefono: '829-555-1234', tipoSangre: 'O+', email: 'pedro.gomez@email.com' },
            { nombres: 'Laura', apellidos: 'Martínez', cedula: '002-7654321-2', telefono: '809-222-3333', tipoSangre: 'A-', email: 'laura.martinez@email.com' },
            { nombres: 'Miguel', apellidos: 'Santos', cedula: '003-1112223-3', telefono: '849-444-5555', tipoSangre: 'B+', email: 'miguel.santos@email.com' },
        ],
        skipDuplicates: true,
    });
    // 8. Usuarios (contraseña hasheada con bcrypt)
    const empleadoList = await prisma.empleado.findMany();
    const passwordAdmin = await bcrypt_1.default.hash('Admin1234!', 10);
    const passwordLaura = await bcrypt_1.default.hash('Laura1234!', 10);
    const passwordMiguel = await bcrypt_1.default.hash('Miguel1234!', 10);
    await prisma.usuario.createMany({
        data: [
            { username: 'admin', passwordHash: passwordAdmin, rol: 'ADMIN', empleadoId: empleadoList[0].id },
            { username: 'laura', passwordHash: passwordLaura, rol: 'USER', empleadoId: empleadoList[1].id },
            { username: 'miguel', passwordHash: passwordMiguel, rol: 'USER', empleadoId: empleadoList[2].id },
        ],
        skipDuplicates: true,
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
