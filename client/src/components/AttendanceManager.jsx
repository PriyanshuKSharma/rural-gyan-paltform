import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Download, Users, Clock, Calendar } from 'lucide-react';

const AttendanceManager = () => {
  const { classId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  useEffect(() => {
    fetchAttendance();
    fetchClassData();
  }, [classId]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAttendance(data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setClassData(data.data);
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, isPresent) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}/attendance/mark`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, isPresent })
      });
      
      if (response.ok) {
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const batchMarkAttendance = async (isPresent) => {
    if (selectedStudents.size === 0) {
      alert('Please select students first');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const updates = Array.from(selectedStudents).map(studentId => ({
        studentId,
        isPresent
      }));

      const response = await fetch(`/api/virtual-class/${classId}/attendance/batch`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        setSelectedStudents(new Set());
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error batch marking attendance:', error);
    }
  };

  const exportAttendance = async (format = 'csv') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}/attendance/export?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${classData?.title || 'class'}_attendance.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        console.log('Attendance data:', data);
      }
    } catch (error) {
      console.error('Error exporting attendance:', error);
    }
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const selectAll = () => {
    if (selectedStudents.size === attendance.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(attendance.map(a => a.student._id)));
    }
  };

  const formatDuration = (joinedAt, leftAt) => {
    if (!joinedAt) return 'N/A';
    
    const start = new Date(joinedAt);
    const end = leftAt ? new Date(leftAt) : new Date();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    return `${minutes} MIN`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 cyber-bg min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
        <div className="absolute w-full h-full bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_DASHBOARD
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cyber-glitch-text" data-text="ATTENDANCE_LOG">
              ATTENDANCE_LOG
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2" />
          </div>
          
          {classData && (
            <div className="cyber-card p-4 flex items-center gap-6 text-sm text-cyan-100/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{new Date(classData.scheduledAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{classData.duration} MIN</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span>GRADE {classData.grade}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mb-8 flex flex-wrap gap-4">
        <button
          onClick={selectAll}
          className="cyber-btn-secondary px-6 py-2"
        >
          {selectedStudents.size === attendance.length ? 'DESELECT_ALL' : 'SELECT_ALL'}
        </button>
        
        <button
          onClick={() => batchMarkAttendance(true)}
          disabled={selectedStudents.size === 0}
          className="cyber-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          MARK_PRESENT
        </button>
        
        <button
          onClick={() => batchMarkAttendance(false)}
          disabled={selectedStudents.size === 0}
          className="px-6 py-2 bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 clip-path-polygon"
        >
          <X className="w-4 h-4" />
          MARK_ABSENT
        </button>
        
        <button
          onClick={() => exportAttendance('csv')}
          className="cyber-btn-secondary px-6 py-2 ml-auto flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          EXPORT_CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-green-500">
          <div className="text-3xl font-bold text-green-400 mb-1 font-mono">
            {attendance.filter(a => a.isPresent).length.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-green-500/80 tracking-widest font-bold">PRESENT_COUNT</div>
        </div>
        
        <div className="cyber-card p-6 border-l-4 border-l-red-500">
          <div className="text-3xl font-bold text-red-400 mb-1 font-mono">
            {attendance.filter(a => !a.isPresent).length.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-red-500/80 tracking-widest font-bold">ABSENT_COUNT</div>
        </div>
        
        <div className="cyber-card p-6 border-l-4 border-l-cyan-500">
          <div className="text-3xl font-bold text-cyan-400 mb-1 font-mono">
            {attendance.length.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-cyan-500/80 tracking-widest font-bold">TOTAL_STUDENTS</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="relative z-10 cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-900/30 bg-cyan-950/20">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === attendance.length && attendance.length > 0}
                    onChange={selectAll}
                    className="cyber-checkbox rounded border-cyan-500/50 bg-gray-900/50 checked:bg-cyan-500 focus:ring-cyan-500/50"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">STUDENT_ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">STATUS_LOG</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">LOGIN_TIME</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">LOGOUT_TIME</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">DURATION</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 tracking-widest">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/10">
              {attendance.map((record) => (
                <tr key={record.student._id} className="hover:bg-cyan-900/5 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(record.student._id)}
                      onChange={() => toggleStudentSelection(record.student._id)}
                      className="cyber-checkbox rounded border-cyan-500/50 bg-gray-900/50 checked:bg-cyan-500 focus:ring-cyan-500/50"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-none border border-cyan-500/30 bg-cyan-950/30 flex items-center justify-center mr-4 group-hover:border-cyan-400/60 transition-colors">
                        <span className="text-lg font-bold text-cyan-400 font-mono">
                          {record.student.fullName?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                          {record.student.fullName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {record.student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider border ${
                      record.isPresent 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        record.isPresent ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' : 'bg-red-400 shadow-[0_0_5px_#f87171]'
                      }`} />
                      {record.isPresent ? 'PRESENT' : 'ABSENT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {record.joinedAt ? new Date(record.joinedAt).toLocaleTimeString() : '--:--:--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {record.leftAt ? new Date(record.leftAt).toLocaleTimeString() : <span className="text-cyan-400 animate-pulse">ACTIVE_SESSION</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {formatDuration(record.joinedAt, record.leftAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => markAttendance(record.student._id, true)}
                        className="p-1.5 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                        title="Mark Present"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => markAttendance(record.student._id, false)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Mark Absent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendance.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-300 mb-2">NO_DATA_FOUND</h3>
            <p className="text-gray-500 font-mono text-sm">WAITING_FOR_STUDENT_CONNECTION...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManager;