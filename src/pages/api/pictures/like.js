import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
    const token = await getToken({ req: request });
    const userId = token?.sub;
    if (!userId) {
        return response.status(401).json({ status: "Not Authorized" });
    }

    await dbConnect();
    const { id } = request.query;
    if (request.method === "POST") {
        try {
            const like = await Picture.findOneAndUpdate(
                { _id: id, likedBy: { $ne: userId } },
                { $push: { likedBy: userId }, $inc: { likes: 1 } },
                { new: true },
            );
            if (!like) {
                return response
                    .status(404)
                    .json({ status: "not found or already liked" });
            }
            return response.status(200).json(like);
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt like picture" });
        }
    } else {
        if (request.method === "DELETE") {
            try {
                const like = await Picture.findOneAndUpdate(
                    { _id: id, likedBy: userId },
                    { $pull: { likedBy: userId }, $inc: { likes: -1 } },
                    { new: true },
                );
                if (!like) {
                    return response
                        .status(404)
                        .json({ status: "not found or not liked" });
                }
                return response.status(200).json(like);
            } catch (error) {
                console.error(error);
                return response.status(400).json({ message: "couldnt unlike" });
            }
        } else {
            return response.status(405).json({ message: "Method not allowed" });
        }
    }
}
