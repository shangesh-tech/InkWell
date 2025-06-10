import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/config/db";
import { User } from "./lib/models/User";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({

    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        Credentials({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember me", type: "checkbox" }
            },

            authorize: async (credentials) => {
                const email = credentials.email || "";
                const password = credentials.password || "";

                if (!email || !password) {
                    throw new CredentialsSignin("Please provide both email & password");
                }

                await connectDB();

                const user = await User.findOne({ email }).select("+password +role");

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                if (!user.password) {
                    throw new Error("Invalid email or password");
                }

                const isMatched = await compare(password, user.password);

                if (!isMatched) {
                    throw new Error("Password did not matched");
                }

                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    id: user._id,
                };

                return userData;
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
        // Default session max age is 24 hours
        maxAge: 24 * 60 * 60,
    },

    callbacks: {
        async session({ session, token }) {
            if (token?.sub && token?.role) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },

        async jwt({ token, user, account, trigger, session }) {
            if (user) {
                token.role = user.role;
            }

            // Update session maxAge based on remember me
            if (trigger === "signIn" && account?.type === "credentials") {
                token.remember = session?.remember === "true";
                if (token.remember) {
                    token.maxAge = 30 * 24 * 60 * 60; // 30 days
                }
            }

            return token;
        },

        signIn: async ({ user, account }) => {
            if (account?.provider === "google" || account?.provider === "github") {
                try {
                    const { email, name, image, id } = user;
                    await connectDB();
                    const existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        // Create new user if email doesn't exist
                        const [firstName, ...lastNameParts] = name.split(" ");
                        await User.create({
                            firstName: firstName || name,
                            lastName: lastNameParts.join(" ") || "",
                            email,
                            image,
                            authProviderId: id,
                            authProvider: account.provider,  // Set provider dynamically
                            role: "user"
                        });
                    } else {
                        // If user exists, update their OAuth info and allow sign in
                        await User.findOneAndUpdate(
                            { email },
                            {
                                image: image || existingUser.image,
                                authProviderId: id,
                                authProvider: account.provider,  // Update to current provider
                                firstName: existingUser.firstName || name.split(" ")[0],
                                lastName: existingUser.lastName || name.split(" ").slice(1).join(" ") || ""
                            }
                        );
                    }
                    return true;
                } catch (error) {

                    throw new Error(error.message || "Error during authentication");
                }
            }

            if (account?.provider === "credentials") {
                return true;
            }

            return false;
        },
    },
});
