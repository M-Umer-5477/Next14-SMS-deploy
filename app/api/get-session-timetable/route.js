// pages/api/session-timetable.js
import db from '@/lib/db';
import SessionTimetable from '@/models/sessiontimetablemodel';

export async function GET(request) {
  await db.connect();

  try {
    // Extract CourseID from the URL
    const url = new URL(request.url);
    const courseID = url.searchParams.get('courseId');

    if (!courseID) {
      return new Response(JSON.stringify({ error: 'CourseID is required' }), { status: 400 });
    }

    // Fetch session timetable entries for the course
    const sessionTimetable = await SessionTimetable.find({ CourseID: courseID });

    if (sessionTimetable.length === 0) {
      return new Response(JSON.stringify({ message: 'No session timetable found for the given CourseID' }), { status: 404 });
    }

    return new Response(JSON.stringify(sessionTimetable), { status: 200 });
  } catch (error) {
    console.error('Error fetching session timetable:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    await db.disconnect();
  }
}
