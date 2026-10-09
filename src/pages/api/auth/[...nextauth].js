import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/user";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({
                    email: credentials.email?.trim().toLowerCase(),
                });
                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash,
                );
                if (!isValid) return null;
                return { id: user._id.toString(), email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
};

export default NextAuth(authOptions);
