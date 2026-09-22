import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;

    if (request.method === "GET") {
        try {
            const picture = await Picture.findById(id);
            if (!picture) {
                return response.status(404).json({ status: "Not found" });
            }
            return response.status(200).json(picture);
        } catch (error) {
            console.error(error);
            response.status(400).json({ mesage: "couldnt get ur picture" });
        }
    } else if (request.method === "PUT") {
        try {
            const pictureData = request.body;
            await Picture.findByIdAndUpdate(id, pictureData);
            return response
                .status(200)
                .json({ status: `Picture ${id} updated` });
        } catch (error) {
            console.error(error);
            return response.status(400).json({ message: "couldnt update" });
        }
    } else if (request.method === "DELETE") {
        try {
            await Picture.findByIdAndDelete(id);
            return response
                .status(200)
                .json({ status: `Picture ${id} was deleted` });
        } catch (error) {
            console.error(error);
            return response.status(405).json({ message: "couldnt Delete" });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
