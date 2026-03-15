import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Plus, Trash2, Edit, X, Loader2 } from 'lucide-react';
import { teacherAPI } from '../../services/api';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIMING_SLOTS = [
  { id: 1, start: '08:00', end: '09:00', label: '8:00 AM - 9:00 AM' },
  { id: 2, start: '09:00', end: '10:00', label: '9:00 AM - 10:00 AM' },
  { id: 3, start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM' },
  { id: 4, start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM' },
  { id: 5, start: '12:00', end: '13:00', label: '12:00 PM - 1:00 PM' },
  { id: 6, start: '13:00', end: '14:00', label: '1:00 PM - 2:00 PM' },
  { id: 7, start: '14:00', end: '15:00', label: '2:00 PM - 3:00 PM' },
  { id: 8, start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM' },
];

// Standard subjects by class
const SUBJECTS_BY_CLASS = {
  '5th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education'],
  '6th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education'],
  '7th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education'],
  '8th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education'],
  '9th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'ICT', 'Physical Education'],
  '10th': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'ICT', 'Physical Education'],
  '11th': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Physical Education'],
  '12th': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Physical Education'],
};

// Default classes if none assigned
const DEFAULT_CLASSES = ['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

// All subjects for fallback
const ALL_SUBJECTS = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Art', 'Physical Education', 'ICT'];

// Helper function to format 24-hour time to 12-hour format
const formatTime = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

// Helper function to format time range
const formatTimeRange = (startTime, endTime) => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const Timetable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClass, setSelectedClass] = useState('10th');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    className: '10th',
    subject: '',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:00'
  });

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherAPI.getSchedule();
      if (response.data.success) {
        setSchedules(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await teacherAPI.getClasses();
      if (response.data.success) {
        const assignedClasses = response.data.data.assignedClasses || [];
        // Use default classes if none assigned
        const classesToUse = assignedClasses.length > 0 ? assignedClasses : DEFAULT_CLASSES;
        setClasses(classesToUse);
        setSelectedClass(classesToUse[0]);
        setFormData(prev => ({ ...prev, className: classesToUse[0] }));
      } else {
        setClasses(DEFAULT_CLASSES);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses(DEFAULT_CLASSES);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await teacherAPI.updateSchedule(editingSchedule._id, formData);
      } else {
        await teacherAPI.createSchedule(formData);
      }
      fetchSchedules();
      setShowModal(false);
      setEditingSchedule(null);
      setFormData({
        className: selectedClass,
        subject: '',
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:00'
      });
    } catch (err) {
      console.error('Error saving schedule:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await teacherAPI.deleteSchedule(id);
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      className: schedule.className,
      subject: schedule.subject,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingSchedule(null);
    setFormData({
      className: selectedClass,
      subject: '',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '09:00'
    });
    setShowModal(true);
  };

  const getSubjectsForClass = (className) => {
    return SUBJECTS_BY_CLASS[className] || ALL_SUBJECTS;
  };

  const getScheduleForSlot = (day, timeSlot) => {
    return schedules.find(s => 
      s.dayOfWeek === day && 
      s.className === selectedClass &&
      s.startTime === timeSlot.start
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Weekly Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your class schedule</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <Plus size={20} />
            Add Class
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 w-24">
                  Time
                </th>
                {DAYS_OF_WEEK.slice(0, 6).map(day => (
                  <th key={day} className="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMING_SLOTS.map(slot => (
                <tr key={slot.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                    {slot.label}
                  </td>
                  {DAYS_OF_WEEK.slice(0, 6).map(day => {
                    const schedule = getScheduleForSlot(day, slot);
                    return (
                      <td key={day} className="px-2 py-2 border-l border-gray-200 dark:border-gray-700">
                        {schedule ? (
                          <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg p-2">
                            <div className="font-medium text-sm text-cyan-900 dark:text-cyan-300">
                              {schedule.subject}
                            </div>
                            <div className="text-xs text-cyan-700 dark:text-cyan-400 mt-1">
                              {formatTimeRange(schedule.startTime, schedule.endTime)}
                            </div>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <button
                                onClick={() => openEditModal(schedule)}
                                className="p-1 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(schedule._id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[60px]"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Scheduled Classes</h3>
        {schedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={16} className="text-cyan-600" />
                      <span className="font-medium text-gray-900 dark:text-white">{schedule.subject}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Class {schedule.className}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(schedule)} className="p-1 text-gray-500 hover:text-cyan-600">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(schedule._id)} className="p-1 text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {schedule.dayOfWeek}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No classes scheduled yet. Click "Add Class" to create your timetable.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSchedule ? 'Edit Class' : 'Add Class'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class
                </label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value, subject: '' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Subject</option>
                  {getSubjectsForClass(formData.className).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Day of Week
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {TIMING_SLOTS.map(slot => (
                      <option key={slot.start} value={slot.start}>{slot.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {TIMING_SLOTS.filter(s => s.start > formData.startTime).map(slot => (
                      <option key={slot.start} value={slot.start}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  {editingSchedule ? 'Update' : 'Add'} Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
