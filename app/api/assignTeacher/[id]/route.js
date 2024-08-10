import db from '@/lib/db';
import Assignment from '@/models/assignmentmodel';
import Teacher from '@/models/teachermodel';
export async function DELETE(req,ctx) {
    await db.connect()
    const { id } = ctx.params.id;
console.log(id,ctx.params.id);
   

    try {
        await Assignment.findByIdAndDelete(id)
                console.log("Existing assignment deleted");
        return new Response(JSON.stringify({msg: 'Successfully deleted post'}), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Assignment not replaced' }), { status: 400 });
            }
    }