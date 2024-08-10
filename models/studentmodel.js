import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the schema for the Student table
const studentSchema = new Schema({
    StudentID: {
        type: String,
        required: true,
        unique: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    Gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    ContactInfo: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
      },
    PersonalEmail: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
    ProfilePicture: {
        type: String
      },
    Courses: [{
        type: String,
        ref: 'Course'
      }]
    }, {
      timestamps: true
});

export default mongoose?.models?.Student || mongoose.model("Student", studentSchema)
