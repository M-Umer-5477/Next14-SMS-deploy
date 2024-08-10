import db from '@/lib/db';
import Teacher from '@/models/teachermodel';
import bcrypt from 'bcrypt';

export async function POST(request) {
  await db.connect();

  try {
    const body = await request.json();
    const { TeacherID, FirstName, LastName, PersonalEmail, Department, ProfilePicture, email, password } = body;

    // Improved logging for debugging
    console.log("Request body:", body);

    // Check for missing fields, but allow ProfilePicture to be optional
    if (!TeacherID || !FirstName || !LastName || !PersonalEmail || !Department || !email || !password) {
      console.log("Missing required fields");
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(PersonalEmail)) {
      console.log("Invalid email format");
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
    }

    // Check if the email already exists
    const existingEmail = await Teacher.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
    }

    // Check if the TeacherID already exists
    const existingTeacher = await Teacher.findOne({ TeacherID });
    if (existingTeacher) {
      console.log("Teacher already exists");
      return new Response(JSON.stringify({ error: 'Teacher already exists' }), { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = new Teacher({
      TeacherID,
      FirstName,
      LastName,
      PersonalEmail,
      Department,
      ProfilePicture: ProfilePicture || '',  // Allow ProfilePicture to be empty
      email,
      password: hashedPassword  // Store hashed password
    });

    console.log("New Teacher:", JSON.stringify(newTeacher));

    await newTeacher.save();

    console.log("Teacher created successfully");
    return new Response(JSON.stringify({ message: 'Teacher created successfully' }), { status: 201 });

  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}


export async function GET() {
    try {
        await db.connect();

        try {
            // Fetch all teachers from the database
            const teachers = await Teacher.find({});
            console.log("Found teachers:", teachers);
            return new Response(JSON.stringify({ success: true, data: teachers }), { status: 200 });
        } catch (error) {
            // Handle errors when fetching teachers
            console.error("Error fetching teachers:", error);
            return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
        } finally {
            // Disconnect from the database
            await db.disconnect();
        }
    } catch (error) {
        // Handle database connection errors
        console.error("Failed to connect to the database:", error);
        return new Response(JSON.stringify({ success: false, error: "Failed to connect to the database" }), { status: 500 });
    }
}
