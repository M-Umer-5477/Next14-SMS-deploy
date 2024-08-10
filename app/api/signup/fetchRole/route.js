import db from '@/lib/db';
import User from '@/models/usermodel';

export async function GET(request) {
    await db.connect();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ role: user.Role }), { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
