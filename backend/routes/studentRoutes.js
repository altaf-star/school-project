const express = require('express');
const { body } = require('express-validator');
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  withdrawStudent,
  getStats,
  exportStudents,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const studentValidation = [
  body('admissionNumber').notEmpty().withMessage('Admission number is required'),
  body('name').notEmpty().withMessage('Student name is required'),
  body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
  body('enrolledClass').notEmpty().withMessage('Enrolled class is required'),
];

router.get('/stats', getStats);
router.get('/export', exportStudents);

router.route('/')
  .get(getStudents)
  .post(studentValidation, createStudent);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

router.put('/:id/withdraw', withdrawStudent);

module.exports = router;
