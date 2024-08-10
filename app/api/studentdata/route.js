import db from '@/lib/db';
import Enrollment from '@/models/enrollmentmodel';
import Student from '@/models/studentmodel';
import Course from '@/models/coursemodel';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    await db.connect();

    try {
        const student = await Student.findOne({ email });

        if (!student) {
            return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
        }

        const StudentID = student.StudentID;
        const courseEnrolled = await Enrollment.find({ StudentID });
        const courseIds = courseEnrolled.map((enrollment) => enrollment.CourseID);

        const coursesEnrolled = await Course.find({ CourseID: { $in: courseIds } });
        console.log(coursesEnrolled);

        const responseData = {
            student,
            coursesEnrolled
        };
        console.log(responseData);

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}
