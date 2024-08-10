import db from '@/lib/db';
import Assignment from '@/models/assignmentmodel';
import Teacher from '@/models/teachermodel';
import Course from '@/models/coursemodel';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    await db.connect();

    try {
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return new Response(JSON.stringify({ error: 'Teacher not found' }), { status: 404 });
        }

        const TeacherID = teacher.TeacherID;
        const courseAssigned = await Assignment.find({ TeacherID });
        const courseIds = courseAssigned.map((assignment) => assignment.CourseID);

        const coursesAssigned = await Course.find({ CourseID: { $in: courseIds } });

        const responseData = {
            teacher,
            coursesAssigned
        };

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}
