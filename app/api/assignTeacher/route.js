import db from '@/lib/db';
import Assignment from '@/models/assignmentmodel';
import Teacher from '@/models/teachermodel';
import Course from '@/models/coursemodel';

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const { AssignmentID, TeacherID, CourseID, AssignmentDate } = body;

        // Log request body
        console.log("Request body:", body);

        if (!AssignmentID || !TeacherID || !CourseID || !AssignmentDate) {
            console.log("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Check if teacher exists
        const teacher = await Teacher.findOne({ TeacherID });
        if (!teacher) {
            console.log("Teacher not found");
            return new Response(JSON.stringify({ error: 'Teacher not found' }), { status: 404 });
        }

        // Check if assignment already exists for the course
        const existingAssignment = await Assignment.findOne({ CourseID });
        if (existingAssignment) {
            console.log("Course already assigned to another teacher");
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'This course is already assigned to another teacher.', 
                existingAssignment 
            }), { status: 405 });
        }

        // Create new assignment
        const newAssignment = new Assignment({
            AssignmentID,
            TeacherID,
            CourseID,
            AssignmentDate
        });

        await newAssignment.save();
        teacher.Courses.push(CourseID);
        await teacher.save();

        console.log("Assignment created successfully");
        return new Response(JSON.stringify({ message: 'Assignment created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function DELETE(request) {
    await db.connect();
  
    try {
      const { searchParams } = new URL(request.url);
      const courseId = searchParams.get('courseId');
  
      if (!courseId) {
        return new Response(JSON.stringify({ error: 'Course ID is required' }), { status: 400 });
      }
  
      const existingAssignment = await Assignment.findOne({ CourseID: courseId });
      if (!existingAssignment) {
        return new Response(JSON.stringify({ error: 'Assignment not found' }), { status: 404 });
      }
  
      await Assignment.deleteOne({ CourseID: courseId });
  
      return new Response(JSON.stringify({ message: 'Assignment deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error("Server error:", error);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }
  export async function GET(request) {
    await db.connect();
  
    try {
      const { searchParams } = new URL(request.url);
      const courseId = searchParams.get('courseId');
  
      if (!courseId) {
        return new Response(JSON.stringify({ error: 'Course ID is required' }), { status: 400 });
      }
  
      const assignment = await Assignment.findOne({ CourseID: courseId });
      console.log("Found assignment:", assignment);
      if (!assignment) {
        return new Response(JSON.stringify({ error: 'Assignment not found' }), { status: 404 });
      }
  
      const teachers = await Teacher.find();
      
      return new Response(JSON.stringify({ assignment , teachers}), { status: 200 });
    } catch (error) {
      console.error("Server error:", error);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }