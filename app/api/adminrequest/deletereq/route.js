import db from '@/lib/db';
import Request from '@/models/requestmodel';

export async function DELETE(request) {
    await db.connect();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        await Request.deleteOne({email: email});
        console.log("Request deleted successfully");
        return new Response(JSON.stringify({ message: 'Request deleted successfully' }), { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}