import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        text: { type: String, required: true },
        pictureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture",
            required: true,
        },
    },
    { timestamps: true },
);

const Comment =
    mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
