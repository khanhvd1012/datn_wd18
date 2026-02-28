import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import router from './src/routers/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));

app.use("/api", router);

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export { app };
