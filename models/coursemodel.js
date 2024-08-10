import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a new schema for Course
const courseSchema = new Schema({
  CourseID: {
    type: String,
    required: true,
    unique: true
  },
  CourseName: {
    type: String,
    required: true
  },
  CourseDescription: {
    type: String,
    required: true
  },
  Credits: {
    type: Number,
    required: true
  },
  Department: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create a model from the schema
export default mongoose?.models?.Course || mongoose.model("Course", courseSchema);
