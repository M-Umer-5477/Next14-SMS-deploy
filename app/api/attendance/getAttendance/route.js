import db from '@/lib/db';
import Attendance from '@/models/attendancemodel';
import Student from '@/models/studentmodel';

export async function GET(request) {
  await db.connect();

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const studentEmail = searchParams.get('studentemail');

    if (!courseId || !studentEmail) {
      return new Response(JSON.stringify({ error: 'Missing courseId or studentemail parameter' }), { status: 400 });
    }

    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
        return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
    }

    const attendance = await Attendance.find({
      CourseID: courseId,
      StudentID: student.StudentID
    });

    return new Response(JSON.stringify(attendance), { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    await db.disconnect();
  }
}
