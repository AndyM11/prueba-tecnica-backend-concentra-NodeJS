import express from 'express';
import manufacturerRoutes from './interfaces/routes/manufacturer.routes';
import articleRoutes from './interfaces/routes/article.routes';
import locationRoutes from './interfaces/routes/location.routes';
import placementRoutes from './interfaces/routes/placement.routes';
import clientRoutes from './interfaces/routes/client.routes';
import buyRoutes from './interfaces/routes/buy.routes';
import employeeRoutes from './interfaces/routes/employee.routes';
import { swaggerSchemas } from './infrastructure/swaggerSchemas';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './infrastructure/middleware/errorHandler';

// Cargar para variables de entorno
dotenv.config();

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Almacenes',
            version: '1.0.0',
        },
        components: {
            schemas: swaggerSchemas
        }
    },
    apis: ['./src/interfaces/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'method'
    }
}));

// Middlewares de seguridad y utilidades
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(json());

// Rutas de fabricantes
app.use('/api/v1/manufacturer', manufacturerRoutes);
app.use('/api/v1/article', articleRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/placement', placementRoutes);
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/buy', buyRoutes);
app.use('/api/v1/employee', employeeRoutes);

// Rutas base (puedes importar tus rutas aquí)
app.get('/', (req, res) => {
    res.json({ message: 'Inicio API para Almacenes' });
});

app.use(errorHandler);

export default app;
