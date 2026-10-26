import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Student name is required'], trim: true, minlength: [2, 'Name must be at least 2 characters'], maxlength: [80, 'Name cannot exceed 80 characters'] },
  email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, unique: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'] },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Please enter a valid phone number'] },
  city: { type: String, required: [true, 'City is required'], trim: true, maxlength: [60, 'City cannot exceed 60 characters'] },
  category: { type: String, required: [true, 'Category is required'], trim: true, maxlength: [60, 'Category cannot exceed 60 characters'] }
}, { timestamps: true, versionKey: false });

studentSchema.index({ name: 1 });
studentSchema.index({ city: 1, category: 1 });

export default mongoose.model('Student', studentSchema);
