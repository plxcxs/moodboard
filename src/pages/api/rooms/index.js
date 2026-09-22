import dbConnect from "../../../../db/connect";
import Room from "../../../../db/models/room";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        try {
            const rooms = await Room.find();
            return response.status(200).json(rooms);
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else if (request.method === "POST") {
        try {
            const roomData = request.body;

            await Room.create(roomData);

            response.status(201).json({ status: "Room created" });
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
