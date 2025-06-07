import 'dotenv/config';
import express from 'express';
import { recordRoutes } from './records';
import { treeRoutes } from './tree';
import { linkRoutes } from './links';
import { errorHandler } from './errorHandler';
import cors from 'cors';

const PORT = process.env.BACKEND_PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);
app.use(recordRoutes);
app.use(treeRoutes);
app.use(linkRoutes);

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on port ${PORT}`);
});
