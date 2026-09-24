import dbConnect from "../../../../db/connect";
import Picture from "../../../../db/models/picture";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

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
            const pictureToDelete = await Picture.findById(id);
            await cloudinary.v2.uploader.destroy(pictureToDelete.publicId);
            await Picture.findByIdAndDelete(id);
            return response
                .status(200)
                .json({ status: `Picture ${id} was deleted` });
        } catch (error) {
            console.error(error);
            return response.status(400).json({ message: "couldnt Delete" });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
