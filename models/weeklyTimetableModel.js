import mongoose from 'mongoose';
const { Schema } = mongoose;

const weeklyTimetableSchema = new Schema({
  CourseID: {
    type: String,
    ref: 'Course',
    required: true,
  },
  Day: {
    type: String,
    required: true,
  },
  StartTime: {
    type: String,
    required: true,
  },
  EndTime: {
    type: String,
    required: true,
  },
  Room: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.WeeklyTimetable || mongoose.model('WeeklyTimetable', weeklyTimetableSchema);
