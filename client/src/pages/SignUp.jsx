import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.email,
          email: formData.email,
          role: formData.role.toLowerCase(),
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center cyber-bg font-mono overflow-hidden relative">
      {/* Background Overlay Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10" style={{
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 51%)',
        backgroundSize: '100% 4px'
      }}></div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 p-6 relative z-10">
        {/* Left Panel - Branding */}
        <div className="lg:w-1/2 flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-cyan-500 relative flex items-center justify-center bg-gray-900/80 backdrop-blur">
              <div className="absolute inset-0 border border-cyan-500 blur-[2px] opacity-50"></div>
              <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white cyber-glitch-text" data-text="NDEMLP">
              NDEMLP
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 leading-tight">
              JOIN THE<br/>NETWORK
            </h2>
            <p className="text-cyan-100/70 text-lg max-w-md border-l-2 border-cyan-500 pl-4">
              Initialize your neural link and access the future of education.
            </p>
          </div>

          <div className="flex gap-4 text-xs font-bold tracking-widest text-cyan-700 uppercase">
            <span>System: Online</span>
            <span>//</span>
            <span>Nodes: 8,492</span>
            <span>//</span>
            <span>Secured: True</span>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="cyber-card w-full max-w-md p-8 lg:p-12">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="mb-8 text-center relative">
              <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">
                {t('createAccount')}
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  {t('fullName')}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="cyber-input py-2"
                  placeholder="ENTER_FULL_NAME"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  {t('emailAddress')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="cyber-input py-2"
                  placeholder="ENTER_EMAIL_ADDRESS"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  {t('yourRole')}
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="cyber-input py-2 appearance-none"
                  >
                    <option value="" className="bg-gray-900 text-gray-400">SELECT_ROLE</option>
                    <option value="student" className="bg-gray-900 text-cyan-100">STUDENT</option>
                    <option value="teacher" className="bg-gray-900 text-cyan-100">TEACHER</option>
                    <option value="admin" className="bg-gray-900 text-cyan-100">ADMINISTRATOR</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cyan-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="cyber-input py-2 pr-12"
                    placeholder="CREATE_PASSWORD"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-700 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="cyber-input py-2"
                  placeholder="CONFIRM_PASSWORD"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn-primary w-full mt-6 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                  {!loading && (
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
              <button
                onClick={toggleLanguage}
                className="text-xs font-bold text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                {i18n.language === 'en' ? 'LANG: HI' : 'LANG: EN'}
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-400 transition-colors uppercase tracking-wider"
              >
                {t('logIn')} &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SignUp;