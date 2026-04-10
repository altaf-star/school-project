const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      required: [true, 'Admission number is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    fatherName: {
      type: String,
      trim: true,
      default: '',
    },
    motherName: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    enrolledClass: {
      type: String,
      required: [true, 'Enrolled class is required'],
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'withdrawn', 'graduated'],
      default: 'active',
    },
    withdrawalDetails: {
      withdrawalClass: { type: String, default: '' },
      slcIssued: { type: Boolean, default: false },
      withdrawalDate: { type: Date },
    },
  },
  { timestamps: true }
);

studentSchema.index({ name: 'text', admissionNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
