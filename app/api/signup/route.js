import db from '@/lib/db';
import User from '@/models/usermodel';
import Teacher from '@/models/teachermodel';
import Student from '@/models/studentmodel';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const { role, registrationCode, ...data } = body;

        console.log("Signup attempt for role:", role);

        // Validate Registration Codes
        if (role === 'SuperAdmin' || role === 'Admin') {
            const expectedSecret = role === 'SuperAdmin' ? process.env.SUPER_ADMIN_SECRET : process.env.ADMIN_SECRET;
            if (registrationCode !== expectedSecret) {
                return new Response(JSON.stringify({ error: 'Invalid registration code for Admin' }), { status: 403 });
            }

            const { username, email, password } = data;
            if (!username || !email || !password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

            const isExisting = await User.findOne({ email });
            if (isExisting) return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name: username,
                email,
                password: hashedPassword,
                Role: role
            });
            await newUser.save();
            return new Response(JSON.stringify({ message: `${role} created successfully` }), { status: 201 });

        } else if (role === 'Teacher') {
            if (registrationCode !== process.env.TEACHER_SECRET) {
                return new Response(JSON.stringify({ error: 'Invalid registration code for Teacher' }), { status: 403 });
            }

            const { TeacherID, FirstName, LastName, email, PersonalEmail, password, Department } = data;
            if (!TeacherID || !FirstName || !LastName || !email || !PersonalEmail || !password || !Department) {
                return new Response(JSON.stringify({ error: 'Missing teacher fields' }), { status: 400 });
            }

            const isExisting = await Teacher.findOne({ email });
            if (isExisting) return new Response(JSON.stringify({ error: 'Teacher already exists' }), { status: 400 });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newTeacher = new Teacher({
                TeacherID, FirstName, LastName, email, PersonalEmail, password: hashedPassword, Department
            });
            await newTeacher.save();
            return new Response(JSON.stringify({ message: 'Teacher created successfully' }), { status: 201 });

        } else if (role === 'Student') {
            if (registrationCode !== process.env.STUDENT_SECRET) {
                return new Response(JSON.stringify({ error: 'Invalid registration code for Student' }), { status: 403 });
            }

            const { StudentID, FirstName, LastName, DateOfBirth, Gender, ContactInfo, Address, email, PersonalEmail, password } = data;
            if (!StudentID || !FirstName || !LastName || !DateOfBirth || !Gender || !ContactInfo || !Address || !email || !PersonalEmail || !password) {
                return new Response(JSON.stringify({ error: 'Missing student fields' }), { status: 400 });
            }

            const isExisting = await Student.findOne({ email });
            if (isExisting) return new Response(JSON.stringify({ error: 'Student already exists' }), { status: 400 });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newStudent = new Student({
                StudentID, FirstName, LastName, DateOfBirth, Gender, ContactInfo, Address, email, PersonalEmail, password: hashedPassword
            });
            await newStudent.save();
            return new Response(JSON.stringify({ message: 'Student created successfully' }), { status: 201 });
            
        } else {
            return new Response(JSON.stringify({ error: 'Invalid role specified' }), { status: 400 });
        }
    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error: ' + error.message }), { status: 500 });
    }
}
