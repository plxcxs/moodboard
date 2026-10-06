import dbConnect from "../../../../db/connect";
import Comment from "../../../../db/models/comments";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        try {
            const { pictureId } = request.query;
            const comments = await Comment.find({ pictureId }).sort({
                createdAt: -1,
            });
            return response.status(200).json(comments);
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt find comments" });
        }
    } else if (request.method === "POST") {
        try {
            const { text, pictureId } = request.body;
            const trimmedText = text?.trim();

            if (!trimmedText || !pictureId) {
                return response
                    .status(400)
                    .json({ message: "text and pictureId required" });
            }
            await Comment.create({ text: trimmedText, pictureId });
            return response.status(201).json({ status: "Comment created" });
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt create comment" });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
