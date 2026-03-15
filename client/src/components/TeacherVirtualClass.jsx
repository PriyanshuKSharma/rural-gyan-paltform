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
    if (!window.confirm('Are you sure you want to end this class?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`/api/virtual-class/${classId}/end`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Class ended successfully');
      fetchClasses();
      
      // If currently in the class, navigate back
      if (window.location.pathname.includes(classId)) {
        navigate('/teacher/virtual-class');
      }
    } catch (error) {
      console.error('Error ending class:', error);
      alert('Failed to end class');
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
    <div className="p-6 bg-[#0a0f1c] text-slate-200 min-h-screen relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[100px] transform -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Class Management
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Create and manage your virtual classroom sessions</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            New Session
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {classes.map((classItem) => (
          <div key={classItem._id} className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6 group hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-500 shadow-xl">
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
        <div className="fixed inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 border border-slate-700 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Modal Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                New Session
              </h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={createClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  placeholder="Enter class title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject Matter</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Grade Level</label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                  >
                    <option value="">Select Grade</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Schedule Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  rows="3"
                  placeholder="Session details..."
                />
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  <Check className="w-5 h-5" />
                  Confirm
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