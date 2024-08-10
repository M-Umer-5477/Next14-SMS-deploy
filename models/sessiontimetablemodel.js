import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a new schema for SessionTimetable
const sessionTimetableSchema = new Schema({
  CourseID: {
    type: String,
    ref: 'Course',
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
 
  StartTime: {
    type: String,
    required: true
  },
  EndTime: {
    type: String,
    required: true
  },
  Room: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.SessionTimetable || mongoose.model('SessionTimetable', sessionTimetableSchema);
