import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        try {
            const token = await getToken({ req: request });
            const userId = token?.sub;
            const { roomId } = request.query;
            const pictures = await Picture.find({ roomId }).lean();
            const result = pictures.map(({ likedBy = [], ...picture }) => ({
                ...picture,
                isLiked: likedBy.includes(userId),
            }));
            return response.status(200).json(result);
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt find picture" });
        }
    } else if (request.method === "POST") {
        try {
            const pictureData = request.body;
            const hasText = Boolean(pictureData.text?.trim());
            const hasPicture = Boolean(pictureData.picture);

            if (!hasPicture && !hasText) {
                return response
                    .status(400)
                    .json({ message: "text or picture required" });
            }

            await Picture.create(pictureData);
            return response.status(201).json({ status: "Picture created" });
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt create picture" });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
