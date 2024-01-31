import express, { Application } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './routes/User';
import Product from './routes/Product';
import Order from './routes/Order';
import Inventory from './routes/Inventory';
import { customRateLimiter } from './middleware/rateLimiter';


process.on('uncaughtException', err => {
    console.log(err.stack)
    console.log('Server is sutting down due to uncaught exception')
    process.exit(1)
})

dotenv.config();

const app: Application = express();
app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",customRateLimiter)

app.use("/",User);
app.use("/",Product);
app.use("/",Order);
app.use("/",Inventory);




mongoose.connect(process.env.MONGODB as string).then((con) => console.log(`Mongodb connectd with host: ${con.connection.host}`))


const server = app.listen(process.env.PORT || 5000, () => console.log(`Server is running on Port: 5000`))

process.on('unhandledRejection', err => {
    console.log(err)
    console.log('Server is sutting down due to unhandled rejection')
    server.close(() => process.exit(1))
})