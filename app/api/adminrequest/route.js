import db from '@/lib/db';
import Request from '@/models/requestmodel';
import User from '@/models/usermodel';
import bcrypt from 'bcrypt';
export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const { username, email, password: pass }= body;

        // Improved logging for debugging
        console.log("Request body:", body);

        if (!username || !email || !pass) {
            console.log("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        const userCount = await User.countDocuments();
        console.log("User count:", userCount);

        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash(pass, 10);
            const newUser = new User({
                name: username,
                email,
                password: hashedPassword,
                Role: 'SuperAdmin'
            });

            console.log("Creating SuperAdmin:", JSON.stringify(newUser));
            await newUser.save();

            console.log("SuperAdmin created successfully");
            return new Response(JSON.stringify({ message: 'SuperAdmin created successfully' }), { status: 201 });
        }

        const isExisting = await Request.findOne({ email });
        console.log("Existing Request:", isExisting);

        if (isExisting) {
            console.log("Request already exists");
            return new Response(JSON.stringify({ error: 'Request already exists' }), { status: 400 });
        }
        const newRequest = new Request({
            name: username,
            email,
            password:pass,
            Role:'Admin'
        });

        console.log("New Request:", JSON.stringify(newRequest));

        await newRequest.save();

        console.log("Request created successfully");
        return new Response(JSON.stringify({ message: 'Request created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
export async function GET(req, res) {
    await db.connect();
  


    try {
       

        const res = await Request.find();
        

        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error('Error fetching:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
