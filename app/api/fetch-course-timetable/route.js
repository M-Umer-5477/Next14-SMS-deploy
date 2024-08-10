// pages/api/fetch-course-timetable.js
import db from '@/lib/db';
import Timetable from '@/models/timetablemodel';

export async function GET(request) {
  await db.connect();

  try {
    
    const { searchParams } = new URL(request.url);
    const courseID = searchParams.get('courseID');
    const sessionStartDate = searchParams.get('sessionStartDate');
    const sessionEndDate = searchParams.get('sessionEndDate');

    const timetableEntries = await Timetable.find({
      CourseID: courseID,
      Date: { $gte: new Date(sessionStartDate), $lte: new Date(sessionEndDate) }
    });

    return new Response(JSON.stringify(timetableEntries), { status: 200 });
  } catch (error) {
    console.error('Error fetching timetable entries:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    await db.disconnect();
  }
}