//app.ts

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import cors from 'cors';
import connectDB from './infrastructure/DBConfig/DB';
import authRouter from './presentation/Router/authRouter';
import postRouter from './presentation/Router/postRouter';
import profileRouter from './presentation/Router/profileRouter'
import path from 'path';

const app = express();

const corsOptions = {
    origin: process.env.REDIRECT_URL,
    credentials: true,
    exposedHeaders: ['x-access-token'],
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter)
app.use('/api/profile', profileRouter)

connectDB();

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;