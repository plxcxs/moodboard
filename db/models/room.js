import mongoose from "mongoose";

const { Schema } = mongoose;

const roomSchema = new Schema({
    RoomName: { type: String, required: true },
    RoomColor: { type: String, required: true },
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
