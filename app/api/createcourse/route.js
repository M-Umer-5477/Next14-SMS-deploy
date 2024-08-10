import db from '@/lib/db';

import Course from '@/models/coursemodel';

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const {  CourseID,
        CourseName,
        CourseDescription,
        Credits,
        Department} = body;

        // Improved logging for debugging
        console.log("Request body:", body);

        if (!CourseID || !CourseName || !CourseDescription || ! Credits || !Department) {
            console.log("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const isExisting = await Course.findOne({ CourseName });
        console.log("Existing Course:", isExisting);

        if (isExisting) {
            console.log("Course already exists");
            return new Response(JSON.stringify({ error: 'Course already exists' }), { status: 400 });
        }

    

        const newCourse = new Course({
            CourseID,
            CourseName,
            CourseDescription,
            Credits,
            Department
        });

        console.log("NewCourse:", JSON.stringify(newCourse));

        await newCourse.save();

        console.log("Course created successfully");
        return new Response(JSON.stringify({ message: 'Course created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
/* export async function GET(req, res) {
    await db.connect();
  
    
      try {
        const courses = await Course.find({});
        console.log(courses);
        return new Response(JSON.stringify(courses), { status:200});
    
      } catch (error) {
        console.error('Error fetching courses:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
      }
    
  }*/
  /*export async function GET(req, res) {
    await db.connect();
  
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 4;
  
    try {
        const courses = await Course.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCourses = await Course.countDocuments();

        const response = {
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: page,
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}*/
export async function GET(req, res) {
    await db.connect();
  
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 4;
    const searchQuery = searchParams.get('query') || '';

    try {
        const query = {
            $or: [
                { CourseName: { $regex: searchQuery, $options: 'i' } },
                { Department: { $regex: searchQuery, $options: 'i' } },
            ],
        };

        const courses = await Course.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCourses = await Course.countDocuments(query);

        const response = {
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: page,
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}