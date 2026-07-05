
import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import User from "@/models/usermodel";
import Teacher from "@/models/teachermodel";  // Import the Teacher model
import Student from "@/models/studentmodel";
import bcrypt from 'bcryptjs';
import db from "@/lib/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: 'Username', type: 'text', placeholder: 'username' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const { email , password } = credentials;
                await db.connect();

                let user;

                if (email.includes('@teacher.com')) {
                    // Handle teacher login
                    user = await Teacher.findOne({ email });
                    if (!user) {
                        throw new Error("Invalid username or password");
                    }
                    // Compare simple password for teachers
                    const comparePass = await bcrypt.compare(password, user.password);
                    if (!comparePass) {
                        throw new Error("Invalid username or password");
                    }
                    const { password: _, ...teacherData } = user._doc;
                    return { ...teacherData };
                } else if (email.includes('@student.com')) {
                    // Handle teacher login
                    user = await Student.findOne({ email });
                    if (!user) {
                        throw new Error("Invalid username or password");
                    }
                    // Compare simple password for teachers
                    const comparePass = await bcrypt.compare(password, user.password);
                    if (!comparePass) {
                        throw new Error("Invalid username or password");
                    }
                    const { password: _, ...studentData } = user._doc;
                    return { ...studentData };
                }
                else {
                    // Handle admin login
                    user = await User.findOne({ email });
                    if (!user) {
                        throw new Error("Invalid username or password");
                    }

                    const comparePass = await bcrypt.compare(password, user.password);

                    if (!comparePass) {
                        throw new Error("Invalid username or password");
                    } else {
                        const { password, ...currentUser } = user._doc;
                        return { ...currentUser };
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    }
});

export { handler as GET, handler as POST };
