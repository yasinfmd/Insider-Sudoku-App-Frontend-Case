import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
    playerName: string;
    score: number;
    timestamp: Date;
    gameTime:string,
    rank:'beginner' | 'intermediate' | 'hard' | 'expert';
}

const ScoreSchema = new Schema({
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    gameTime: {type:String,required:true},
    rank:{type:String,required:true},
});

export default mongoose.model<IScore>('Score', ScoreSchema);