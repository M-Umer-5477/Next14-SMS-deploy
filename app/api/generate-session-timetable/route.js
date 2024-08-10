// pages/api/generate-session-timetable.js
import db from '@/lib/db';
import WeeklyTimetable from '@/models/weeklyTimetableModel';
import SessionTimetable from '@/models/sessiontimetablemodel';

export async function POST(request) {
  await db.connect();

  try {
    const { CourseID, sessionStartDate, sessionEndDate } = await request.json();
    
    // Check if the request data is correctly received
    console.log('Received data:', { CourseID, sessionStartDate, sessionEndDate });
    
    const startDate = new Date(sessionStartDate);
    const endDate = new Date(sessionEndDate);

    // Fetch weekly timetable entries for the course
    const weeklyEntries = await WeeklyTimetable.find({ CourseID });
    
    // Log fetched weekly entries
    console.log('Fetched weekly entries:', weeklyEntries);

    // Generate dates for the session based on weekly entries
    const sessionDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      // Find weekly entries that match the current day
      const dailyEntries = weeklyEntries.filter(entry => entry.Day === dayOfWeek);

      // Create session timetable entries
      dailyEntries.forEach(entry => {
        sessionDates.push({
          CourseID,
          Date: new Date(currentDate),
          StartTime: entry.StartTime,
          EndTime: entry.EndTime,
          Room: entry.Room
        });
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Log generated session dates
    console.log('Generated session dates:', sessionDates);

    // Save session timetable entries to the database
    await SessionTimetable.deleteMany({ CourseID}); // Clear existing entries
    await SessionTimetable.insertMany(sessionDates);

    return new Response(JSON.stringify({ message: 'Session timetable generated successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error generating session timetable:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    await db.disconnect();
  }
}
