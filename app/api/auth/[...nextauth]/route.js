import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

const db = require('../../../../server/db.js');
const bcrypt = require('bcrypt');

const handler = NextAuth({
    secret: process.env.AUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {

                const query = "SELECT * FROM users WHERE username = ?";
                return new Promise((resolve, reject) => {
                    db.query(query, [credentials.username], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (result.length === 0) {
                            resolve(null);
                            return;
                        }

                        const isPasswordMatch = bcrypt.compareSync(credentials.password, result[0].password);

                        if (isPasswordMatch) {
                            console.log("Password matches");
                            const user = { id: result[0].id, username: result[0].username };
                            resolve(user);
                        } else {
                            console.log("Password does not match");
                            resolve(null);
                        }
                    });
                });
            }
        })
    ], session: {
        jwt: true
    },
    callbacks: {
        async session({ session, token }) {
          session.user = token.user;
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.user = user;
          }
          return token;
        }
    }
});

export { handler as GET, handler as POST };

