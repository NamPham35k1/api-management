import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import dotenv from 'dotenv';

dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.config';
import apiRoutes from './routers';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.send("ok");
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Không thể khởi động server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
