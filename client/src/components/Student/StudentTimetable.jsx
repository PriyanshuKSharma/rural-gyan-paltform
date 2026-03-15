import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Loader2 } from 'lucide-react';
import { studentAPI } from '../../services/api';

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

const StudentTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      
      // Use the new student API endpoint that fetches ALL schedules
      const response = await studentAPI.getTimetable();
      console.log('Timetable response:', response.data);
      
      if (response.data.success) {
        setSchedules(response.data.data);
        
        // Get unique classes from schedules
        const classes = [...new Set(response.data.data.map(s => s.className))];
        console.log('Available classes:', classes);
        
        if (classes.length > 0 && selectedClass === 'all') {
          setSelectedClass(classes[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSchedules = () => {
    if (selectedClass === 'all') return schedules;
    return schedules.filter(s => s.className === selectedClass);
  };

  const getScheduleForSlot = (day, timeSlot) => {
    return getFilteredSchedules().find(s => 
      s.dayOfWeek === day && 
      s.startTime === timeSlot.start
    );
  };

  const availableClasses = [...new Set(schedules.map(s => s.className))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Timetable</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View class schedules
        </p>
      </div>

      {/* Class Filter */}
      {availableClasses.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">View Schedule for:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Classes</option>
            {availableClasses.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
      )}

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
                          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2 text-center">
                            <div className="font-medium text-sm text-green-900 dark:text-green-300">
                              {schedule.subject}
                            </div>
                            <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                              {formatTimeRange(schedule.startTime, schedule.endTime)}
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

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredSchedules().length > 0 ? (
            getFilteredSchedules().map((schedule, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{schedule.subject}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Class {schedule.className} - {schedule.dayOfWeek}, {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No classes scheduled yet. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
