import dbConnect from "../../../../db/connect";
import Room from "../../../../db/models/room";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;

    if (request.method === "GET") {
        try {
            const room = await Room.findById(id);
            if (!room) {
                return response.status(404).json({ status: "Not found" });
            }
            return response.status(200).json(room);
        } catch (error) {
            console.error(error);
            response.status(400).json({ message: "couldnt get room" });
        }
    } else if (request.method === "PUT") {
        try {
            const roomData = request.body;
            await Room.findByIdAndUpdate(id, roomData);
            return response
                .status(200)
                .json({ status: `Room ${id} was updated` });
        } catch (error) {
            console.error(error);
            return response.status(400).json({ message: "couldnt update" });
        }
    } else if (request.method === "DELETE") {
        try {
            await Room.findByIdAndDelete(id);
            return response
                .status(200)
                .json({ status: `Room ${id} was deleted` });
        } catch (error) {
            console.error(error);
            return response.status(400).json({ message: "couldnt Delete" });
        }
    } else {
        return response.status(405).json({ message: "method not found" });
    }
}
