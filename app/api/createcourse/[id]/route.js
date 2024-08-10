import db from '@/lib/db';

import Course from '@/models/coursemodel';
export async function GET(req, ctx) {
    await db.connect();
    const id = ctx.params.id;
    console.log(`Fetching course with ID: ${id}`);
    try {
        const course = await Course.findById(id);

        if (!course) {
            return new Response(JSON.stringify({ success: false, error: 'Course not found' }), { status: 404 });
        }
        console.log('found course', course);

        return new Response(JSON.stringify({ success: true, data: course }), { status: 200 });
    } catch (error) {
        console.error(`Error fetching course with ID: ${id}`, error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}

export async function DELETE(req, ctx) {
    await db.connect()

    const id = ctx.params.id

   

    try {
        await Course.findByIdAndDelete(id)

        return new Response(JSON.stringify({msg: 'Successfully deleted post'}), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 }) 
    }
}
export async function PUT(req, ctx) {
    await db.connect()

    const id = ctx.params.id
    

    try {
        const body = await req.json()
        const post = await Course.findById(id)

        

        const updatedCourse = await Course.findByIdAndUpdate(id, { $set: { ...body } }, { new: true })

        return new Response(JSON.stringify(updatedCourse), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}