import mongoose from "mongoose";

const { Schema } = mongoose;

const pictureSchema = new Schema({
    picture: { type: String, required: true },
});
const Picture =
    mongoose.models.Picture || mongoose.model("Picture", pictureSchema);
export default Picture;
