/*import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import User from "@/models/usermodel";
import bcrypt from 'bcrypt'
import db from "@/lib/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'Kobe Bryant'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials, req){
                const {email, password} = credentials
                await db.connect()
                
                                
                const user = await User.findOne({ email })

                if(!user){
                    throw new Error("Invalid input")
                }

             
                
                const comparePass = await bcrypt.compare(password, user.password)

                if(!comparePass){
                    throw new Error("Invalid input")
                } else {
                    const {password, ...currentUser} = user._doc
                    return {
                        ...currentUser,
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    }
})

export {handler as GET, handler as POST}*/
import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import User from "@/models/usermodel";
import Teacher from "@/models/teachermodel";  // Import the Teacher model
import Student from "@/models/studentmodel";
import bcrypt from 'bcrypt';
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
                    return { ...user._doc };
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
                    return { ...user._doc };
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
    }
});

export { handler as GET, handler as POST };
