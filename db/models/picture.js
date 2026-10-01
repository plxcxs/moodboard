import mongoose from "mongoose";

const { Schema } = mongoose;

const pictureSchema = new Schema({
    publicId: { type: String },
    picture: { type: String },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    likes: { type: Number, required: true, default: 0 },
    text: { type: String },
});
const Picture =
    mongoose.models.Picture || mongoose.model("Picture", pictureSchema);
export default Picture;
