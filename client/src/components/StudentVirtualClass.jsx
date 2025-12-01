import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Users, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';

const StudentVirtualClass = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableClasses();
  }, []);

  const fetchAvailableClasses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/virtual-class/student/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailableClasses(data.data);
      }
    } catch (error) {
      console.error('Error fetching available classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinClass = async (classId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        navigate(`/virtual-class/${classId}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join class');
      }
    } catch (error) {
      console.error('Error joining class:', error);
      alert('Failed to join class');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'live': return 'text-red-400 border-red-400/50 bg-red-400/10 animate-pulse';
      case 'ended': return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  const getTimeUntilClass = (scheduledAt) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diffMs = classTime - now;
    
    if (diffMs < 0) return 'STARTED';
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} DAY(S)`;
    if (diffHours > 0) return `${diffHours} HOUR(S)`;
    if (diffMins > 0) return `${diffMins} MIN(S)`;
    return 'SOON';
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
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cyber-glitch-text" data-text="AVAILABLE_CLASSES">
              AVAILABLE_CLASSES
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2" />
            <p className="text-cyan-600 mt-2 font-mono text-sm">SECURE_CONNECTION_READY // JOIN_SESSION</p>
          </div>
          
          <button
            onClick={fetchAvailableClasses}
            className="cyber-btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH_DATA
          </button>
        </div>
      </div>

      {availableClasses.length === 0 ? (
        <div className="text-center py-16 relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700">
            <Video className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">NO_CLASSES_DETECTED</h3>
          <p className="text-gray-500 font-mono">SYSTEM_WAITING_FOR_SCHEDULE...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {availableClasses.map((classItem) => (
            <div key={classItem._id} className="cyber-card p-6 group hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">
                  {classItem.title}
                </h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${getStatusColor(classItem.status)}`}>
                  {classItem.status === 'live' ? '● LIVE_FEED' : classItem.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <span className="w-24 text-cyan-600">SUBJECT:</span>
                  <span className="text-cyan-100">{classItem.subject}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <span className="w-24 text-cyan-600">GRADE:</span>
                  <span className="text-cyan-100">{classItem.grade}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <span className="w-24 text-cyan-600">INSTRUCTOR:</span>
                  <span className="text-cyan-100">{classItem.teacherId?.userId?.fullName || 'UNKNOWN'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <span className="w-24 text-cyan-600">TIME:</span>
                  <span className="text-cyan-100">{new Date(classItem.scheduledAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <span className="w-24 text-cyan-600">DURATION:</span>
                  <span className="text-cyan-100">{classItem.duration} MIN</span>
                </div>
                
                {classItem.status === 'scheduled' && (
                  <div className="flex items-center text-sm font-mono bg-gray-800/50 p-2 rounded border border-gray-700">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-gray-400 mr-2">STARTS_IN:</span>
                    <span className="text-yellow-400 font-bold">
                      {getTimeUntilClass(classItem.scheduledAt)}
                    </span>
                  </div>
                )}
              </div>

              {classItem.description && (
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-mono border-l-2 border-gray-700 pl-3 italic">
                  "{classItem.description}"
                </p>
              )}

              <div className="flex flex-col space-y-3">
                {classItem.status === 'live' && (
                  <button
                    onClick={() => joinClass(classItem._id)}
                    className="cyber-btn-primary w-full py-3 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
                  >
                    <Video className="w-4 h-4" />
                    JOIN_LIVE_FEED
                  </button>
                )}
                
                {classItem.status === 'scheduled' && (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed font-mono text-sm flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    SCHEDULED_LOCKED
                  </button>
                )}
                
                <div className="text-[10px] text-gray-600 text-center font-mono mt-2">
                  ID: {classItem.meetingId}
                </div>
              </div>

              {/* Participants count */}
              <div className="mt-4 pt-4 border-t border-cyan-900/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{classItem.participants?.length || 0} CONNECTED</span>
                </div>
                {classItem.status === 'live' && (
                  <span className="text-green-400 animate-pulse">● SIGNAL_ACTIVE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentVirtualClass;