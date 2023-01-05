import { compare } from 'bcryptjs';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "E-mail", type: "email", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) { 
                const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${credentials?.email}`, {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "http://localhost:3000"
                    }
                });
                const json = await response.json();
                if (!json || !(await compare(credentials!.password, json.data.password))) {
                    return null;
                } else {
                    return { email: json.data.email, name: json.data.name, id: json.data._id };
                }
            }
        }),
        GoogleProvider({
            clientId: "564585516138-v7ep4gchgu96uinru560bnpdhn5je4rp.apps.googleusercontent.com",
            clientSecret: "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",
        })
    ]
};

export default NextAuth(authOptions);
// 안씀