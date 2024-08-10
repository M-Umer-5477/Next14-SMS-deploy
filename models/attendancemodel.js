import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a new schema for Attendance
const attendanceSchema = new Schema({
  AttendanceID: {
    type: String,
    required: true,
    unique: true
  },
  StudentID: {
    type: String,
    ref: 'Student',
    required: true
  },
  CourseID: {
    type: String,
    ref: 'Course',
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Status: {
    type: String,
    enum: ['Present', 'Absent', 'Excused'],
    required: true
  },
  Timeslot: {
    Day: {
      type: String,
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
  }
}, {
  timestamps: true
});

// Create a model from the schema
export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);


