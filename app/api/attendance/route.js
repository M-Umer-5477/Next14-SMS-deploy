import db from '@/lib/db';
import Attendance from '@/models/attendancemodel';

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        console.log("Received request body:", body);

        const { attendanceRecords } = body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            console.log("Invalid or missing attendance records");
            return new Response(JSON.stringify({ error: 'Invalid or missing attendance records' }), { status: 400 });
        }

        for (const record of attendanceRecords) {
            const { AttendanceID, StudentID, CourseID, Status, Lecture } = record;

            console.log("Lecture string:", Lecture);

            // Use regex to extract date and time range
            const lectureRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\d{2}:\d{2}) - (\d{2}:\d{2})$/;
            const match = Lecture.match(lectureRegex);

            if (!match) {
                console.log("Invalid Lecture format:", Lecture);
                return new Response(JSON.stringify({ error: 'Invalid Lecture format' }), { status: 400 });
            }

            const [_, dateString, StartTime, EndTime] = match;
            const date = new Date(dateString);

            // Derive Day from the Date object
            const Day = date.toDateString();

            // Validate the extracted values
            if (!date || isNaN(date.getTime()) || !StartTime || !EndTime) {
                console.log("Invalid or missing date/time information:", { date, StartTime, EndTime });
                return new Response(JSON.stringify({ error: 'Invalid or missing date/time information' }), { status: 400 });
            }

            // Create Timeslot object
            const Timeslot = { Day, StartTime, EndTime };

            // Check if the attendance record already exists
            const existingRecord = await Attendance.findOne({
                StudentID,
                CourseID,
                Date: date,
                'Timeslot.Day': Timeslot.Day,
                'Timeslot.StartTime': Timeslot.StartTime,
                'Timeslot.EndTime': Timeslot.EndTime
            });

            if (existingRecord) {
                console.log(`Attendance already recorded for StudentID: ${StudentID}, CourseID: ${CourseID}, Date: ${date}, Timeslot: ${JSON.stringify(Timeslot)}`);
                continue;
            }

            // Save the new attendance record
            try {
                const newAttendance = new Attendance({
                    AttendanceID,
                    StudentID,
                    CourseID,
                    Date: date,
                    Status,
                    Timeslot
                });
                await newAttendance.save();
                console.log("Attendance saved successfully:", newAttendance);
            } catch (saveError) {
                console.error("Error saving attendance record:", saveError);
                return new Response(JSON.stringify({ error: 'Error saving attendance record' }), { status: 500 });
            }
        }

        console.log("All attendance records saved successfully");
        return new Response(JSON.stringify({ message: 'All attendance records saved successfully' }), { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}







