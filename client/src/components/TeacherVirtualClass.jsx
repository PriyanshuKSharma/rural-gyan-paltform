import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Video, Calendar, Clock, Users, ArrowLeft, 
  X, Check, Play, Square, FileText, Trash2 
} from 'lucide-react';

const TeacherVirtualClass = () => {
  const [classes, setClasses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    scheduledAt: '',
    duration: 60
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/virtual-class/teacher/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/virtual-class/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          subject: '',
          grade: '',
          scheduledAt: '',
          duration: 60
        });
        fetchClasses();
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const startClass = async (classId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/virtual-class/${classId}/start`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        navigate(`/virtual-class/${classId}`);
      }
    } catch (error) {
      console.error('Error starting class:', error);
    }
  };

  const endClass = async (classId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`/api/virtual-class/${classId}/end`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClasses();
    } catch (error) {
      console.error('Error ending class:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'live': return 'text-red-400 border-red-400/50 bg-red-400/10 animate-pulse';
      case 'ended': return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
      case 'cancelled': return 'text-red-600 border-red-600/50 bg-red-600/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  return (
    <div className="p-6 cyber-bg min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]" />
        <div className="absolute w-full h-full bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
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
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 cyber-glitch-text" data-text="CLASS_MANAGEMENT">
              CLASS_MANAGEMENT
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-cyan-500 mt-2" />
            <p className="text-purple-400 mt-2 font-mono text-sm">ADMIN_ACCESS_GRANTED // CONTROL_PANEL</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="cyber-btn-primary px-6 py-3 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            <Plus className="w-5 h-5" />
            INITIATE_NEW_SESSION
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {classes.map((classItem) => (
          <div key={classItem._id} className="cyber-card p-6 group hover:border-purple-500/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-purple-100 group-hover:text-purple-400 transition-colors">
                {classItem.title}
              </h3>
              <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${getStatusColor(classItem.status)}`}>
                {classItem.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="w-24 text-purple-500">SUBJECT:</span>
                <span className="text-gray-200">{classItem.subject}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="w-24 text-purple-500">GRADE:</span>
                <span className="text-gray-200">{classItem.grade}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="w-24 text-purple-500">SCHEDULE:</span>
                <span className="text-gray-200">{new Date(classItem.scheduledAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="w-24 text-purple-500">DURATION:</span>
                <span className="text-gray-200">{classItem.duration} MIN</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="w-24 text-purple-500">STUDENTS:</span>
                <span className="text-gray-200">{classItem.participants?.length || 0} ENROLLED</span>
              </div>
            </div>

            {classItem.description && (
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-mono border-l-2 border-gray-700 pl-3 italic">
                "{classItem.description}"
              </p>
            )}

            <div className="flex flex-col gap-2">
              {classItem.status === 'scheduled' && (
                <button
                  onClick={() => startClass(classItem._id)}
                  className="w-full py-2 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 rounded flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  START_SESSION
                </button>
              )}
              
              {classItem.status === 'live' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/virtual-class/${classItem._id}`)}
                    className="flex-1 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 rounded flex items-center justify-center gap-2 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    JOIN
                  </button>
                  <button
                    onClick={() => endClass(classItem._id)}
                    className="flex-1 py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 rounded flex items-center justify-center gap-2 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    END
                  </button>
                </div>
              )}
              
              {(classItem.status === 'ended' || classItem.status === 'cancelled') && (
                <button
                  onClick={() => navigate(`/virtual-class/${classItem._id}/attendance`)}
                  className="w-full py-2 bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  VIEW_ATTENDANCE_LOGS
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-900/30 text-[10px] text-gray-600 text-center font-mono">
              SESSION_ID: {classItem.meetingId}
            </div>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden">
            {/* Modal Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white cyber-glitch-text" data-text="NEW_SESSION">
                NEW_SESSION
              </h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={createClass} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-purple-400 mb-1">SESSION_TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="cyber-input w-full"
                  placeholder="Enter class title..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-purple-400 mb-1">SUBJECT_MATTER</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="cyber-input w-full"
                  placeholder="e.g. Advanced Cybernetics"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-purple-400 mb-1">GRADE_LEVEL</label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="cyber-input w-full"
                  >
                    <option value="">SELECT</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                      <option key={grade} value={grade}>GRADE {grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-purple-400 mb-1">DURATION (MIN)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="cyber-input w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-purple-400 mb-1">SCHEDULE_TIME</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                  className="cyber-input w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-purple-400 mb-1">DESCRIPTION</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="cyber-input w-full"
                  rows="3"
                  placeholder="Session details..."
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 transition-colors font-mono text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 cyber-btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  CONFIRM_CREATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherVirtualClass;