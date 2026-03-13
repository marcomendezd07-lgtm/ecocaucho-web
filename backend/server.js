import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import clientsRoutes from './routes/clientsRoutes.js';
import barbersRoutes from './routes/barbersRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { authRequired } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clients', authRequired, clientsRoutes);
app.use('/api/barbers', authRequired, barbersRoutes);
app.use('/api/services', authRequired, servicesRoutes);
app.use('/api/appointments', authRequired, appointmentsRoutes);
app.use('/api/dashboard', authRequired, dashboardRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor API iniciado en puerto ${port}`);
});
