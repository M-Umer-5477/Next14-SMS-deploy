import db from '@/lib/db';
import Course from '@/models/coursemodel';
export async function GET(req, res) {
    await db.connect();
  


    try {
       

        const courses = await Course.find();
        

        return new Response(JSON.stringify(courses), { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}