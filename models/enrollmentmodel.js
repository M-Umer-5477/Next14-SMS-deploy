import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the schema for the Enrollment table
const enrollmentSchema = new Schema({
    EnrollmentID: {
        type: String,
        required: true,
        unique: true
    },
    StudentID: {
        type: String,
        required: true,
        ref: 'Student'
    },
    CourseID: {
        type: String,
        required: true,
        ref: 'Course'
    },
    EnrollmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Grade: {
        type: String,
        required: false
    }
});

export default mongoose?.models?.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
