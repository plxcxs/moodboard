import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        try {
            const { roomId } = request.query;
            const pictures = await Picture.find({ roomId });
            return response.status(200).json(pictures);
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "couldnt find picture" });
        }
    } else if (request.method === "POST") {
        try {
            const pictureData = request.body;
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
