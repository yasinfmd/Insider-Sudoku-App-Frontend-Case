import express, { Request, Response } from 'express';
import Score from '../models/IScore';

const router = express.Router();

router.post('/scores', async (req: Request, res: Response) => {
    try {
        const { playerName, score,gameTime,rank } = req.body;
        const newScore = new Score({
            playerName,
            score,
            gameTime,
            rank
        });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: "Error", error: error.message });
        } else {
            res.status(400).json({ message: "Error" });
        }
    }
});

router.get('/scores', async (req: Request, res: Response) => {
    try {
        const scores = await Score.find()
            .sort({ score: -1 })
            .limit(10);
        res.json(scores);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error", error: error.message });
        } else {
            res.status(500).json({ message: "Error" });
        }
    }
});

export default router;
