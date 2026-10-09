import dbConnect from "../../../../db/connect";
import Room from "../../../../db/models/room";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
    const session = await getServerSession(request, response, authOptions);
    if (!session) {
        return response.status(401).json({ status: "Not Authorized" });
    }
    await dbConnect();

    const token = await getToken({ req: request });
    const userId = token?.sub;
    const isAdmin = process.env.ADMIN_IDS?.split(",").includes(userId);

    if (request.method === "GET") {
        try {
            const rooms = isAdmin
                ? await Room.find()
                : await Room.find({ Owner: userId });

            return response.status(200).json(rooms);
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else if (request.method === "POST") {
        try {
            const roomData = request.body;

            await Room.create({ ...roomData, Owner: userId });

            response.status(201).json({ status: "Room created" });
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        return response.status(405).json({ message: "Method not Allowed" });
    }
}
