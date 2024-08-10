import db from '@/lib/db';
import Timetable from '@/models/timetablemodel';

export async function GET(req) {
    await db.connect();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    try {
        if (!courseId) {
            return new Response(JSON.stringify({ error: 'Course ID is required' }), { status: 400 });
        }

        // Fetch the timetable for the specified course
        const timetable = await Timetable.find({ CourseID: courseId }).exec();

        if (!timetable || timetable.length === 0) {
            return new Response(JSON.stringify({ error: 'Timetable not found for the given course' }), { status: 404 });
        }

        // Return the timetable data
        return new Response(JSON.stringify(timetable), { status: 200 });

    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}

