import 'dotenv/config';
import express from 'express';
import { recordRoutes } from './records';
import { treeRoutes } from './tree';
import { linkRoutes } from './links';
import { errorHandler } from './error-handler';

const PORT = process.env.PORT;

const app = express();

app.use(errorHandler);
app.use(recordRoutes);
app.use(treeRoutes);
app.use(linkRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
