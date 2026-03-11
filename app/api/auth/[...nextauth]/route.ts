import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { serverApi } from "@/lib/api";

export const authOptions: NextAuthOptions = {
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
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user as any;
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
        strategy: "jwt",
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
