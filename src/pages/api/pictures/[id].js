import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;

    if (request.method === "GET") {
        const picture = await Picture.findById(id);
        if (!picture) {
            return response.status(404).json({ status: "Not found" });
        }
        response.status(200).json(picture);
    }
}
