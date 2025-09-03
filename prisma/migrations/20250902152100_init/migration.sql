-- CreateTable
CREATE TABLE "public"."Fabricante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Fabricante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articulo" (
    "id" SERIAL NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "descripcion" TEXT,
    "fabricanteId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ubicacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Colocacion" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "nombreExhibido" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Colocacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipoCliente" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Compra" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "colocacionId" INTEGER NOT NULL,
    "unidades" INTEGER NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "empleadoId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Empleado" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipoSangre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fabricante_nombre_key" ON "public"."Fabricante"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Articulo_codigoBarras_key" ON "public"."Articulo"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_nombre_key" ON "public"."Ubicacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Colocacion_articuloId_ubicacionId_key" ON "public"."Colocacion"("articuloId", "ubicacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefono_key" ON "public"."Cliente"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_clienteId_colocacionId_key" ON "public"."Compra"("clienteId", "colocacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "public"."Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_cedula_key" ON "public"."Empleado"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_email_key" ON "public"."Empleado"("email");

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_fabricanteId_fkey" FOREIGN KEY ("fabricanteId") REFERENCES "public"."Fabricante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Colocacion" ADD CONSTRAINT "Colocacion_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "public"."Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Colocacion" ADD CONSTRAINT "Colocacion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "public"."Ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compra" ADD CONSTRAINT "Compra_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compra" ADD CONSTRAINT "Compra_colocacionId_fkey" FOREIGN KEY ("colocacionId") REFERENCES "public"."Colocacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "public"."Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
