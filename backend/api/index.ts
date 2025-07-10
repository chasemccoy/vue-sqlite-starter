import 'dotenv/config';
import express from 'express';
import { recordRoutes } from './records';
import { errorHandler } from './errorHandler';
import cors from 'cors';

const PORT = process.env.BACKEND_PORT;

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

app.use(errorHandler);
app.use(recordRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
