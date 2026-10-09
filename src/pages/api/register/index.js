import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/user";
import bcrypt from "bcryptjs";

export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({ message: "Method not Allowed" });
    }
    await dbConnect();
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (!email || !password || password.length < 8) {
        return response.status(400).json({
            message: "Email and Password (min 8 characters) required",
        });
    }
    if (await User.findOne({ email })) {
        return response
            .status(409)
            .json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash });
    return response.status(201).json({ status: "User Created" });
}
