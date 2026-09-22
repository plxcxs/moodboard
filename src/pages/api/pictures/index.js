import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        const pictures = await Picture.find();
        return response.status(200).json(pictures);
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
