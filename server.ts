import express, { Application } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


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







mongoose.connect(process.env.MONGODB as string).then((con) => console.log(`Mongodb connectd with host: ${con.connection.host}`))


const server = app.listen(process.env.PORT || 5000, () => console.log(`Server is running on Port: 5000`))

process.on('unhandledRejection', err => {
    console.log(err)
    console.log('Server is sutting down due to unhandled rejection')
    server.close(() => process.exit(1))
})