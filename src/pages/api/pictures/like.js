import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;
    if (request.method === "POST") {
        try {
            const like = await Picture.findByIdAndUpdate(
                id,
                { $inc: { likes: 1 } },
                { new: true },
            );
            if (!like) {
                return response.status(404).json({ status: "not found" });
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
                const like = await Picture.findByIdAndUpdate(
                    id,
                    { $inc: { likes: -1 } },
                    { new: true },
                );
                if (!like) {
                    return response.status(404).json({ status: "not found" });
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
