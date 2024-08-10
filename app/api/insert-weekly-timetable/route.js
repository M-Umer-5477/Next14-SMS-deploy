import db from '@/lib/db';
import WeeklyTimetable from '@/models/weeklyTimetableModel';

export async function POST(request) {
  await db.connect();

  try {
    const timetableEntries = await request.json();
    console.log('Received request body:', timetableEntries);

    if (!Array.isArray(timetableEntries)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
    }

    // Validate each entry
    for (const entry of timetableEntries) {
      if (!entry.CourseID || !entry.Day || !entry.StartTime || !entry.EndTime) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
      }
    }

    // Check for existing entries to prevent duplicates
    const existingEntries = await Promise.all(
      timetableEntries.map(entry => 
        WeeklyTimetable.findOne({
          CourseID: entry.CourseID,
          Day: entry.Day,
          StartTime: entry.StartTime,
          EndTime: entry.EndTime,
          Room: entry.Room
        })
      )
    );

    if (existingEntries.some(entry => entry !== null)) {
      return new Response(JSON.stringify({ error: 'Duplicate entries found' }), { status: 409 });
    }

    // Insert the timetable entries
    await WeeklyTimetable.insertMany(timetableEntries);

    return new Response(JSON.stringify({ message: 'Weekly timetable inserted successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting weekly timetable:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    await db.disconnect();
  }
}
