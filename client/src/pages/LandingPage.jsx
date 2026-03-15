import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Video, Users, Brain, ArrowRight, ShieldCheck, Play, Sparkles, GraduationCap, Globe, Clock, Github, Linkedin, Twitter } from 'lucide-react';

const LandingPage = () => {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!loading && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const features = [
    {
      icon: <Video className="w-6 h-6 text-indigo-400" />,
      title: 'Virtual Classrooms',
      description: 'Engage in real-time online learning with an integrated whiteboard and high-quality peer-to-peer video.',
      color: 'from-indigo-500/20 to-blue-500/20',
      border: 'group-hover:border-indigo-500/50'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: 'AI-Powered Tutor',
      description: 'Get personalized, 24/7 assistance from our intelligent AI tutor built on advanced natural language processing.',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'group-hover:border-purple-500/50'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Smart Attendance',
      description: 'Automated facial recognition ensures secure, passive, and efficient student attendance tracking.',
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'group-hover:border-emerald-500/50'
    },
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: 'Role-Based Dashboards',
      description: 'Tailored experiences for Instructors, Students, and Admins to manage courses and track progress seamlessly.',
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'group-hover:border-amber-500/50'
    },
  ];

  const stats = [
    { label: 'Active Students', value: '10k+' },
    { label: 'Virtual Classes', value: '500+' },
    { label: 'AI Responses', value: '1M+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] transform -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0a0f1c]/80 backdrop-blur-md border-slate-800 py-3 shadow-lg shadow-black/20' 
          : 'bg-transparent border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Rural Gyan
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/30 opacity-90 group-hover:opacity-100"></div>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center gap-2">
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm shadow-inner shadow-indigo-500/10">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Welcome to the future of learning
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
            <span className="block text-slate-200">Empowering</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-2">
              Rural Education
            </span>
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            A comprehensive learning platform bringing modern classrooms, AI-assisted learning, and seamless management to students everywhere.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
            <Link
              to="/signup"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] focus:ring-indigo-500 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="mr-2">Start Learning For Free</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <a
              href="#features"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-300 transition-all duration-300 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:bg-slate-800 hover:border-slate-600 hover:text-white backdrop-blur-md hover:-translate-y-1 w-full sm:w-auto shadow-lg"
            >
              <Play className="w-5 h-5 mr-3 text-indigo-400 transition-transform duration-300 group-hover:scale-110" />
              See How It Works
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 pt-12 border-t border-slate-800/60 grid grid-cols-2 lg:grid-cols-4 gap-8 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
            {stats.map((stat, idx) => (
               <div key={idx} className="flex flex-col items-center justify-center group">
                 <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 mb-2 group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                   {stat.value}
                 </div>
                 <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                   {stat.label}
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Features Preview Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Platform Features
            </h2>
            <p className="mt-2 text-4xl leading-10 font-extrabold tracking-tight text-white sm:text-5xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-slate-800 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${feature.border}`}
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-150 group-hover:-rotate-12 group-hover:translate-x-4 group-hover:-translate-y-4">
                  {React.cloneElement(feature.icon, { className: 'w-24 h-24' })}
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section with Decorative Abstract Mockup */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div className="mb-16 lg:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Classroom Experience</span>
              </h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
                Connect with educators and peers worldwide. Our platform dissolves geographical boundaries, bringing a premium learning environment directly to your screen, regardless of where you are.
              </p>
              
              <ul className="space-y-6">
                {[
                  { icon: <Globe className="w-6 h-6 text-indigo-400" />, text: "Accessible from anywhere, on any device without friction" },
                  { icon: <Clock className="w-6 h-6 text-purple-400" />, text: "24/7 availability for continuous, uninterrupted learning" },
                  { icon: <GraduationCap className="w-6 h-6 text-pink-400" />, text: "Certification & detailed progress tracking built-in" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
                    <div className="p-3 bg-slate-800/80 rounded-xl shadow-inner border border-slate-700">
                      {item.icon}
                    </div>
                    <span className="text-slate-300 font-medium text-lg leading-snug pt-2">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative group perspective">
              {/* Decorative background elements for mockup */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/40 via-purple-500/40 to-pink-500/40 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 animate-pulse"></div>
              
              {/* Abstract Mockup Window */}
              <div className="relative rounded-[2rem] bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-2xl overflow-hidden transform transition-transform duration-700 hover:rotate-yd hover:-translate-y-2">
                <div className="flex items-center px-6 py-4 bg-slate-800/90 border-b border-slate-700">
                  <div className="flex space-x-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400/90 shadow-sm shadow-red-400/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90 shadow-sm shadow-amber-400/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-sm shadow-emerald-400/50"></div>
                  </div>
                  <div className="mx-auto bg-slate-900/80 rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 flex items-center shadow-inner border border-slate-700/50">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                    app.ruralgyan.edu
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Mock UI Elements */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-40 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="flex gap-3">
                      <div className="h-10 w-10 bg-indigo-500/20 rounded-full border border-indigo-500/30"></div>
                      <div className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="col-span-2 h-48 bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 flex flex-col justify-between">
                      <div className="h-6 w-32 bg-slate-700/80 rounded-lg"></div>
                      <div className="space-y-3 pt-4">
                        <div className="h-4 w-full bg-slate-700/40 rounded-md"></div>
                        <div className="h-4 w-4/5 bg-slate-700/40 rounded-md"></div>
                        <div className="h-4 w-11/12 bg-slate-700/40 rounded-md"></div>
                      </div>
                    </div>
                    <div className="col-span-1 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-6 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute top-4 right-4 h-12 w-12 bg-indigo-500/20 rounded-xl blur-md"></div>
                      <div className="h-12 w-12 bg-indigo-500/40 rounded-xl mb-4 backdrop-blur-sm border border-indigo-400/30"></div>
                      <div className="h-5 w-24 bg-indigo-400/40 rounded-md mb-2"></div>
                      <div className="h-4 w-16 bg-indigo-400/20 rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="h-28 flex-1 bg-slate-800/40 rounded-2xl border border-slate-700/50"></div>
                    <div className="h-28 flex-1 bg-slate-800/40 rounded-2xl border border-slate-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Developers Section */}
        <div id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> The Team
            </h2>
            <p className="mt-2 text-4xl leading-10 font-extrabold tracking-tight text-white sm:text-5xl">
              Meet Our Developers
            </p>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto font-light">
              The passionate minds working behind the scenes to build the future of rural education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Alex Morgan",
                role: "Lead Full-Stack Developer",
                image: "https://i.pravatar.cc/150?u=dev1",
                color: "from-blue-500/20 to-indigo-500/20",
                glow: "group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]",
                ring: "group-hover:from-blue-500 group-hover:to-indigo-500"
              },
              {
                name: "Sarah Chen",
                role: "AI & ML Engineer",
                image: "https://i.pravatar.cc/150?u=dev2",
                color: "from-purple-500/20 to-pink-500/20",
                glow: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
                ring: "group-hover:from-purple-500 group-hover:to-pink-500"
              },
              {
                name: "Marcus Johnson",
                role: "UI/UX & Frontend Developer",
                image: "https://i.pravatar.cc/150?u=dev3",
                color: "from-emerald-500/20 to-teal-500/20",
                glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
                ring: "group-hover:from-emerald-500 group-hover:to-teal-500"
              }
            ].map((dev, idx) => (
              <div key={idx} className={`group relative p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 hover:border-slate-700 ${dev.glow} overflow-hidden text-center flex flex-col items-center`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${dev.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className={`w-28 h-28 rounded-full mb-6 p-1 bg-gradient-to-br from-slate-700 to-slate-800 ${dev.ring} transition-all duration-500 shadow-xl`}>
                    <img src={dev.image} alt={dev.name} className="w-full h-full rounded-full object-cover border-4 border-slate-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{dev.name}</h3>
                  <p className="text-indigo-300 font-medium mb-6">{dev.role}</p>
                  
                  <div className="flex gap-4 items-center justify-center">
                    <a href="#" className="p-2.5 bg-slate-800/80 rounded-full text-slate-400 hover:text-white hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2.5 bg-slate-800/80 rounded-full text-slate-400 hover:text-white hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2.5 bg-slate-800/80 rounded-full text-slate-400 hover:text-white hover:bg-sky-400 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic CTA Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-48">
          <div className="relative rounded-[3rem] overflow-hidden group">
            {/* CTA Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
            
            {/* Animated glowing orbs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pink-500/40 blur-[80px] group-hover:bg-purple-400/50 transition-colors duration-700"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/40 blur-[80px] group-hover:bg-indigo-400/50 transition-colors duration-700"></div>
            
            <div className="relative p-16 md:p-24 text-center z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wider uppercase mb-8">
                Get Started Today
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                Ready to transform your <br className="hidden md:block"/> learning journey?
              </h2>
              <p className="text-xl md:text-2xl text-indigo-100/90 mb-12 max-w-3xl mx-auto font-light">
                Join thousands of students and educators already using Rural Gyan to teach, learn, and grow together.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-indigo-900 bg-white rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 group/btn"
              >
                Create Free Account
                <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover/btn:translate-x-2" />
              </Link>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#060a12] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="text-2xl font-bold text-slate-200">Rural Gyan</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                Empowering education through technology, breaking down geographical barriers, and building a brighter future for learners everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Testimonials</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Legal & Support</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>
              © {new Date().getFullYear()} Rural Gyan Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Built with <span className="text-red-500 mx-1">❤️</span> for everyone.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
