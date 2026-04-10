import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlinePrinter } from 'react-icons/hi';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudent(id)
      .then((res) => setStudent(res.data))
      .catch(() => {
        toast.error('Student not found');
        navigate('/students');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '-');

  const statusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      graduated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      withdrawn: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.active;
  };

  const fields = [
    { label: 'Admission Number', value: student.admissionNumber },
    { label: 'Full Name', value: student.name },
    { label: 'Date of Birth', value: formatDate(student.dateOfBirth) },
    { label: 'Enrolled Class', value: student.enrolledClass },
    { label: "Father's Name", value: student.fatherName || '-' },
    { label: "Mother's Name", value: student.motherName || '-' },
    { label: 'Phone Number', value: student.phoneNumber || '-' },
    { label: 'Admission Date', value: formatDate(student.admissionDate) },
    { label: 'Address', value: student.address || '-' },
    { label: 'Status', value: student.status },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <HiOutlinePrinter className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => navigate(`/students/${id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      <div className="max-w-3xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Admission No: {student.admissionNumber}</p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${statusBadge(student.status)}`}>
            {student.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.label} className={f.label === 'Address' ? 'sm:col-span-2' : ''}>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{f.label}</p>
              <p className="text-gray-900 dark:text-white">
                {f.label === 'Status' ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(f.value)}`}>
                    {f.value}
                  </span>
                ) : (
                  f.value
                )}
              </p>
            </div>
          ))}
        </div>

        {student.status === 'withdrawn' && student.withdrawalDetails && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdrawal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Withdrawal Class</p>
                <p className="text-gray-900 dark:text-white">{student.withdrawalDetails.withdrawalClass || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">SLC Issued</p>
                <p className="text-gray-900 dark:text-white">{student.withdrawalDetails.slcIssued ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Withdrawal Date</p>
                <p className="text-gray-900 dark:text-white">{formatDate(student.withdrawalDetails.withdrawalDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
