import mongoose, {Schema, Document, Collection} from 'mongoose';

export interface ISwipe extends Document {
    swiper : Schema.Types.ObjectId;
    target : Schema.Types.ObjectId;
    direction : "left" | "right";
    createdAt : Date;
    accepted : boolean;
    creator : Schema.Types.ObjectId;
}

const swipeSchema : Schema<ISwipe> = new Schema({
    swiper: {type: Schema.Types.ObjectId, ref: "User", required: true},
    target: {type: Schema.Types.ObjectId, ref : "Trip", required: true},
    direction: {type: String, enum: ["left", "right"], required: true},
    createdAt: {type: Date, default: Date.now},
    accepted: {type: Boolean},
    creator: {type: Schema.Types.ObjectId, ref: "User", required: true}
},
{
 collection: "swipeData"
})


const Swipe = mongoose.model<ISwipe>('Swipe', swipeSchema);

export default Swipe;