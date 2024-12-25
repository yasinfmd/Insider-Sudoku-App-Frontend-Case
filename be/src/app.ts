import express from 'express';
import mongoose from 'mongoose';
import leaderboardRoutes from './routes/leaderboard';
import cors from 'cors'
const app = express();
app.use(cors({}))
app.use(express.json());

const MONGODB_URI = process.env.MONGO_URI || "";
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to db'))
    .catch(err => console.error('Connection error:', err));

app.use('/api', leaderboardRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`App  running on port ${PORT}`);
});

export default app;