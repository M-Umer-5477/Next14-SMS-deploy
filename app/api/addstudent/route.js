import db from '@/lib/db';
import bcrypt from 'bcrypt';
import Student from '@/models/studentmodel';

export async function POST(request) {
  await db.connect();

  try {
    const body = await request.json();
    const {
      student: {
        StudentID,
        FirstName,
        LastName,
        DateOfBirth,
        Gender,
        ContactInfo,
        Address,
        PersonalEmail,
      },
      email,
      password
    } = body;

    // Improved logging for debugging
    console.log("Request body:", body);

    if (!StudentID || !FirstName || !LastName || !DateOfBirth || !Gender || !ContactInfo || !Address || !PersonalEmail || !email || !password) {
      console.log("Missing required fields");
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(PersonalEmail)) {
      console.log("Invalid email format");
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
    }

    // Check if the email already exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
    }

    const isExisting = await Student.findOne({ StudentID });
    console.log("Existing Student:", isExisting);

    if (isExisting) {
      console.log("Student already exists");
      return new Response(JSON.stringify({ error: 'Student already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      StudentID,
      FirstName,
      LastName,
      DateOfBirth,
      Gender,
      ContactInfo,
      Address,
      PersonalEmail,
      ProfilePicture:'',
      email,
      password: hashedPassword
    });

    console.log("NewStudent:", JSON.stringify(newStudent));

    await newStudent.save();

    console.log("Student created successfully");
    return new Response(JSON.stringify({ message: 'Student created successfully' }), { status: 201 });

  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

  
  export async function GET() {
    try {
        await db.connect();

        try {
            const students = await Student.find({});
            console.log("found students" + students);
            return new Response(JSON.stringify({ success: true, data: students }), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
        } finally {
            await db.disconnect();
        }
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to connect to the database" }), { status: 500 });
    }
}
