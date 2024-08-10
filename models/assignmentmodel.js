// models/assignmentModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    AssignmentID: {
        type: String,
        required: true,
        unique: true
    },
    TeacherID: {
        type: String,
        required: true,
        ref: 'Teacher'
    },
    CourseID: {
        type: String,
        required: true,
        ref: 'Course'
    },
    AssignmentDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
