import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a new schema for User
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  Role: {
    type: String,
    enum: ['Admin', 'Super Admin'],
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create a model from the schema
export default mongoose?.models?.User || mongoose.model("User", userSchema)