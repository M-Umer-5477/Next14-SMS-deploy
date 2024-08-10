import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a new schema for Teacher
const teacherSchema = new Schema({
    TeacherID: {
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
    Department: {
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

// Create a model from the schema
export default mongoose?.models?.Teacher || mongoose.model("Teacher", teacherSchema);
