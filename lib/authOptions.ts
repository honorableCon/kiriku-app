import CredentialsProvider from "next-auth/providers/credentials";
import { serverApi } from "@/lib/api";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await serverApi.post("/auth/login", {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const user = response.data.user;
                    const token = response.data.accessToken;

                    if (user && token) {
                        return { ...user, accessToken: token };
                    }
                    return null;
                } catch {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = user.accessToken;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user = token.user;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt" as const,
    }
};