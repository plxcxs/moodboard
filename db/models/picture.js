import mongoose from "mongoose";

const { Schema } = mongoose;

const pictureSchema = new Schema({
    publicId: { type: String, required: true },
    picture: { type: String, required: true },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    likes: { type: Number, required: true, default: 0 },
});
const Picture =
    mongoose.models.Picture || mongoose.model("Picture", pictureSchema);
export default Picture;
