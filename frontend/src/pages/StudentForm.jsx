import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const CLASS_OPTIONS = [
  'Nursery', 'LKG', 'UKG',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
];

const initialForm = {
  admissionNumber: '',
  name: '',
  dateOfBirth: '',
  fatherName: '',
  motherName: '',
  address: '',
  phoneNumber: '',
  enrolledClass: '',
  admissionDate: '',
};

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getStudent(id)
        .then((res) => {
          const s = res.data;
          setForm({
            admissionNumber: s.admissionNumber || '',
            name: s.name || '',
            dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : '',
            fatherName: s.fatherName || '',
            motherName: s.motherName || '',
            address: s.address || '',
            phoneNumber: s.phoneNumber || '',
            enrolledClass: s.enrolledClass || '',
            admissionDate: s.admissionDate ? s.admissionDate.split('T')[0] : '',
          });
        })
        .catch(() => {
          toast.error('Failed to load student');
          navigate('/students');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.admissionNumber || !form.name || !form.dateOfBirth || !form.enrolledClass) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateStudent(id, form);
        toast.success('Student updated successfully');
      } else {
        await createStudent(form);
        toast.success('Student added successfully');
      }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <HiOutlineArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isEdit ? 'Update student information' : 'Fill in the details to register a new student'}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Admission Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admission Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="admissionNumber"
                value={form.admissionNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="e.g. 2024001"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="Student full name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Enrolled Class <span className="text-red-500">*</span>
              </label>
              <select
                name="enrolledClass"
                value={form.enrolledClass}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
              >
                <option value="">Select Class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="Father's name"
              />
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="Mother's name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="e.g. 9876543210"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={form.admissionDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              />
            </div>

            {/* Address - Full width */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 resize-none"
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
