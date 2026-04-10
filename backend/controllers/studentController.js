const { validationResult } = require('express-validator');
const Student = require('../models/Student');

exports.createStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const { search, enrolledClass, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (enrolledClass) {
      query.enrolledClass = enrolledClass;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ admissionNumber: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.withdrawStudent = async (req, res, next) => {
  try {
    const { withdrawalClass, slcIssued, withdrawalDate } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.status !== 'active') {
      return res.status(400).json({ message: `Student is already ${student.status}` });
    }

    student.status = 'withdrawn';
    student.withdrawalDetails = {
      withdrawalClass: withdrawalClass || student.enrolledClass,
      slcIssued: slcIssued || false,
      withdrawalDate: withdrawalDate || new Date(),
    };

    await student.save();
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.graduateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.status !== 'active') {
      return res.status(400).json({ message: `Student is already ${student.status}` });
    }

    student.status = 'graduated';
    await student.save();
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: 'active' });
    const withdrawn = await Student.countDocuments({ status: 'withdrawn' });

    const graduated = await Student.countDocuments({ status: 'graduated' });

    res.json({ total, active, withdrawn, graduated });
  } catch (error) {
    next(error);
  }
};

exports.exportStudents = async (req, res, next) => {
  try {
    const { Parser } = require('json2csv');
    const { enrolledClass, status } = req.query;

    const query = {};
    if (enrolledClass) query.enrolledClass = enrolledClass;
    if (status) query.status = status;

    const students = await Student.find(query).lean();

    const fields = [
      { label: 'Admission No', value: 'admissionNumber' },
      { label: 'Name', value: 'name' },
      { label: 'Date of Birth', value: (row) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : '' },
      { label: 'Father Name', value: 'fatherName' },
      { label: 'Mother Name', value: 'motherName' },
      { label: 'Address', value: 'address' },
      { label: 'Phone', value: 'phoneNumber' },
      { label: 'Class', value: 'enrolledClass' },
      { label: 'Admission Date', value: (row) => row.admissionDate ? new Date(row.admissionDate).toLocaleDateString() : '' },
      { label: 'Status', value: 'status' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(students);

    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
