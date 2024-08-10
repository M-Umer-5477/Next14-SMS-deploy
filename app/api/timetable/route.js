// api/timetable.js

import db from '@/lib/db';
import Timetable from '@/models/timetablemodel';

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const { CourseID, Day, StartTime, EndTime, Room } = body;

        if (!CourseID || !Day || !StartTime || !EndTime || !Room) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const newTimetableEntry = new Timetable({
            CourseID,
            Day,
            StartTime,
            EndTime,
            Room
        });

        await newTimetableEntry.save();

        return new Response(JSON.stringify({ message: 'Timetable entry created successfully' }), { status: 201 });
    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}