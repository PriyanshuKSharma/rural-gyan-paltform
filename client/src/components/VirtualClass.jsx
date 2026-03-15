import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, Phone, 
  MessageSquare, Users, X, Send,
  Clock, CheckCircle, XCircle, Subtitles, Volume2, VolumeX, Presentation, Hand
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Whiteboard from './Whiteboard';

const VideoCard = ({ peer, isLocal, stream, userName }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (peer) {
      peer.on('stream', (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
      });
    } else if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [peer, stream]);

  return (
    <div className="relative bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl group aspect-video">
      <video
        playsInline
        autoPlay
        muted={isLocal}
        ref={videoRef}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-500/30">
        <span className="text-white text-sm font-semibold flex items-center gap-2 tracking-wide">
          {isLocal ? 'You' : userName}
          {isLocal && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"/>}
        </span>
      </div>
      <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 transition-all duration-500 pointer-events-none rounded-2xl" />
    </div>
  );
};

const VirtualClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [classData, setClassData] = useState(null);
  const [timer, setTimer] = useState('00:00:00');
  const [startTime] = useState(Date.now());
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [captionLanguage, setCaptionLanguage] = useState('en-IN');
  const captionTimeoutRef = useRef(null);
  const [raisedHands, setRaisedHands] = useState([]);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const translateText = async (text, targetLang) => {
    if (targetLang === 'en-IN') return text;
    try {
      // Try multiple translation endpoints
      // Method 1: Google Translate (free endpoint)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const translated = data[0]?.[0]?.[0];
        if (translated && translated !== text) {
          return translated;
        }
      }
      
      // Method 2: Fallback to LibreTranslate (if available)
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'hi',
          format: 'text'
        })
      });
      
      if (libreResponse.ok) {
        const libreData = await libreResponse.json();
        return libreData.translatedText || text;
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };
  
  const socketRef = useRef();
  const peersRef = useRef([]);
  const userVideo = useRef();
  const screenTrackRef = useRef();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    fetchClassData();
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        socketRef.current.emit('join-virtual-class', {
          classId,
          userId: user._id,
          userType: user.role,
          userName: user.fullName
        });

        // Handle existing participants (when joining a room with people already in it)
        socketRef.current.on('existing-participants', (participants) => {
          console.log('🟣 Existing participants:', participants);
          participants.forEach(participant => {
            const peer = createPeer(participant.socketId, socketRef.current.id, currentStream);
            peersRef.current.push({
              peerID: participant.socketId,
              peer,
              userName: participant.userName || 'Unknown User',
              userId: participant.userId,
              userType: participant.userType
            });
            setPeers((users) => [...users, { 
              peer, 
              userName: participant.userName || 'Unknown User', 
              peerID: participant.socketId,
              userId: participant.userId,
              userType: participant.userType
            }]);
          });
        });

        // Existing users receive this when a new user joins
        socketRef.current.on('participant-joined', (payload) => {
          console.log('🟢 Participant joined:', payload);
          const peer = createPeer(payload.socketId, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerID: payload.socketId,
            peer,
            userName: payload.userName || 'Unknown User',
            userId: payload.userId,
            userType: payload.userType
          });
          setPeers((users) => [...users, { 
            peer, 
            userName: payload.userName || 'Unknown User', 
            peerID: payload.socketId,
            userId: payload.userId,
            userType: payload.userType
          }]);
          toast.success(`${payload.userName} joined`);
        });

        // New user receives this when an existing user offers a connection
        socketRef.current.on('video-offer', (payload) => {
          console.log('🔵 Video offer received:', payload);
          const peer = addPeer(payload.offer, payload.fromSocketId, currentStream);
          peersRef.current.push({
            peerID: payload.fromSocketId,
            peer,
            userName: payload.userName || 'Connecting...',
            userId: payload.fromUserId,
            userType: payload.userType || 'participant'
          });
          setPeers((users) => [...users, { 
            peer, 
            userName: payload.userName || 'Connecting...',
            peerID: payload.fromSocketId,
            userId: payload.fromUserId,
            userType: payload.userType || 'participant'
          }]);
        });

        socketRef.current.on('video-answer', (payload) => {
          console.log('🟡 Video answer received:', payload);
          const item = peersRef.current.find((p) => p.peerID === payload.fromSocketId);
          if (item) {
            item.peer.signal(payload.answer);
          }
        });

        socketRef.current.on('ice-candidate', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.fromSocketId);
          if (item) {
            item.peer.signal(payload.candidate);
          }
        });

        socketRef.current.on('chat-message', (message) => {
          setMessages((msgs) => [...msgs, message]);
        });

        socketRef.current.on('caption-update', (data) => {
          if (data.userId !== user._id) {
            translateText(data.caption, captionLanguage).then(translated => {
              setCurrentCaption(translated);
              
              if (captionTimeoutRef.current) {
                clearTimeout(captionTimeoutRef.current);
              }
              
              captionTimeoutRef.current = setTimeout(() => {
                setCurrentCaption('');
              }, 5000);
            });
          }
        });

        // Listen for class ended event
        socketRef.current.on('class-ended', () => {
          toast.error('Class has been ended by teacher');
          if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
          }
          const dashboardPath = user.role === 'teacher' ? '/teacher/dashboard' : 
                               user.role === 'student' ? '/student/dashboard' : 
                               '/dashboard';
          setTimeout(() => navigate(dashboardPath), 2000);
        });

        // Listen for teacher controls
        socketRef.current.on('force-mute', () => {
          if (currentStream) {
            currentStream.getAudioTracks()[0].enabled = false;
            setIsAudioEnabled(false);
            toast.error('Teacher muted your microphone');
          }
        });

        socketRef.current.on('force-video-off', () => {
          if (currentStream) {
            currentStream.getVideoTracks()[0].enabled = false;
            setIsVideoEnabled(false);
            toast.error('Teacher turned off your camera');
          }
        });

        // Raise hand events
        socketRef.current.on('hand-raised', (data) => {
          setRaisedHands(prev => [...prev, data]);
          if (user.role === 'teacher') {
            toast(`✋ ${data.userName} raised their hand`, { icon: '✋' });
          }
        });

        socketRef.current.on('hand-lowered', (data) => {
          setRaisedHands(prev => prev.filter(h => h.userId !== data.userId));
        });

        socketRef.current.on('all-hands-lowered', () => {
          setRaisedHands([]);
          setIsHandRaised(false);
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        toast.error("Could not access camera/microphone");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = captionLanguage;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const caption = finalTranscript || interimTranscript;
        setCurrentCaption(caption);
        
        // Clear previous timeout
        if (captionTimeoutRef.current) {
          clearTimeout(captionTimeoutRef.current);
        }
        
        // Auto-clear caption after 5 seconds of no speech
        captionTimeoutRef.current = setTimeout(() => {
          setCurrentCaption('');
        }, 5000);
        
        if (finalTranscript) {
          socketRef.current?.emit('caption-update', {
            classId,
            caption: finalTranscript,
            userId: user._id,
            userName: user.fullName
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setCurrentCaption('');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [captionLanguage, classId, user._id, user.fullName]);

  useEffect(() => {
    if (captionsEnabled && recognitionRef.current) {
      recognitionRef.current.lang = captionLanguage;
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      setCurrentCaption('');
    }
  }, [captionsEnabled, captionLanguage]);

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
    }
  };

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (signal) => {
      if (signal.type === 'offer') {
        socketRef.current.emit('video-offer', { offer: signal, targetSocketId: userToSignal });
      } else if (signal.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: signal, targetSocketId: userToSignal });
      }
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (signal) => {
      if (signal.type === 'answer') {
        socketRef.current.emit('video-answer', { answer: signal, targetSocketId: callerID });
      } else if (signal.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: signal, targetSocketId: callerID });
      }
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen share and switch back to camera
      try {
        screenTrackRef.current.stop();
        
        // Get camera stream again
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = cameraStream.getVideoTracks()[0];
        
        // Replace track in local stream
        const oldTrack = stream.getVideoTracks()[0];
        stream.removeTrack(oldTrack);
        stream.addTrack(videoTrack);
        
        // Update local video
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        
        // Replace track in all peer connections
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc?.getSenders()?.find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        // Notify others
        socketRef.current.emit('stop-screen-share', { classId });
        toast.success('Screen sharing stopped');
        setIsScreenSharing(false);
      } catch (err) {
        console.error('Error stopping screen share:', err);
        toast.error('Failed to stop screen sharing');
      }
    } else {
      // Start screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { cursor: 'always' },
          audio: false
        });
        
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;
        
        // Replace track in local stream
        const oldTrack = stream.getVideoTracks()[0];
        stream.removeTrack(oldTrack);
        stream.addTrack(screenTrack);
        
        // Update local video
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        
        // Replace track in all peer connections
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc?.getSenders()?.find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });
        
        // Handle when user stops sharing via browser UI
        screenTrack.onended = () => {
          toggleScreenShare(); // This will switch back to camera
        };
        
        // Notify others
        socketRef.current.emit('start-screen-share', { 
          classId,
          userId: user._id,
          userName: user.fullName
        });
        
        toast.success('Screen sharing started');
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
        if (err.name === 'NotAllowedError') {
          toast.error('Screen sharing permission denied');
        } else {
          toast.error('Failed to start screen sharing');
        }
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        classId,
        message: newMessage,
        sender: user.role,
        userName: user.fullName,
        userId: user._id,
        timestamp: new Date()
      };
      
      console.log('Sending message with userId:', user._id, 'Full data:', messageData);
      socketRef.current.emit('chat-message', messageData);
      // Don't add locally - wait for server broadcast
      setNewMessage('');
    }
  };

  const leaveClass = () => {
    if (window.confirm("Are you sure you want to leave the class?")) {
      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.emit('leave-virtual-class', classId);
        socketRef.current.disconnect();
      }
      
      // Navigate based on user role
      const dashboardPath = user.role === 'teacher' ? '/teacher/dashboard' : 
                           user.role === 'student' ? '/student/dashboard' : 
                           '/dashboard';
      navigate(dashboardPath);
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
        toast.success(`Attendance marked: ${isPresent ? 'Present' : 'Absent'}`);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  const muteStudent = (studentSocketId) => {
    socketRef.current.emit('teacher-mute-student', { targetSocketId: studentSocketId, classId });
    toast.success('Student muted');
  };

  const turnOffStudentVideo = (studentSocketId) => {
    socketRef.current.emit('teacher-video-off-student', { targetSocketId: studentSocketId, classId });
    toast.success('Student camera turned off');
  };

  const toggleRaiseHand = () => {
    if (isHandRaised) {
      socketRef.current.emit('lower-hand', { classId, userId: user._id });
      setIsHandRaised(false);
      toast.success('Hand lowered');
    } else {
      socketRef.current.emit('raise-hand', { classId, userId: user._id, userName: user.fullName });
      setIsHandRaised(true);
      toast.success('Hand raised');
    }
  };

  const lowerAllHands = () => {
    socketRef.current.emit('lower-all-hands', { classId });
    setRaisedHands([]);
    toast.success('All hands lowered');
  };

  return (
    <div className="flex h-screen bg-[#0a0f1c] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-[#0a0f1c]/90 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                {classData?.title || "Virtual Classroom"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Secure Connection</span>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock size={14} className="text-purple-400" />
                  {timer}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wider rounded-full shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                LIVE
              </span>
              <span className="px-3 py-1 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-bold tracking-wider rounded-full flex items-center gap-2">
                <Users size={14} className="text-indigo-400" />
                {peers.length + 1} ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar pt-20 pb-24">
          {user.role === 'student' ? (
            // Student view: Teacher video large, others small
            <div className="flex flex-col gap-4 h-full">
              {/* Teacher's large video */}
              {peers.find(p => p.userType === 'teacher') ? (
                <div className="flex-1 relative">
                  <div className="relative bg-black rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl h-full w-full">
                    <video
                      playsInline
                      autoPlay
                      ref={(ref) => {
                        if (ref) {
                          const teacherPeer = peers.find(p => p.userType === 'teacher');
                          if (teacherPeer?.peer) {
                            teacherPeer.peer.on('stream', (remoteStream) => {
                              ref.srcObject = remoteStream;
                            });
                          }
                        }
                      }}
                      className="w-full h-full object-contain bg-black"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/50 z-10">
                      <span className="text-white text-lg font-bold flex items-center gap-2">
                        👨‍🏫 {peers.find(p => p.userType === 'teacher')?.userName || 'Teacher'}
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/>
                      </span>
                    </div>
                    {captionsEnabled && currentCaption && (
                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-[90%] bg-black/90 backdrop-blur-md px-6 py-3 rounded-lg border border-green-500/50 shadow-lg z-10">
                        <p className="text-white text-center font-medium">{currentCaption}</p>
                      </div>
                    )}
                  </div>
                  {captionsEnabled && (
                    <div className="absolute top-2 right-2 z-20">
                      <select
                        value={captionLanguage}
                        onChange={(e) => setCaptionLanguage(e.target.value)}
                        className="bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-lg border border-green-500/50 focus:outline-none focus:border-green-500"
                      >
                        <option value="en-IN">🇬🇧 English</option>
                        <option value="hi-IN">🇮🇳 हिन्दी</option>
                      </select>
                    </div>
                  )}
                </div>
              ) : null}
              
              {/* Small videos grid */}
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2" style={{height: '180px'}}>
                {/* Local Video */}
                <VideoCard isLocal={true} stream={stream} userName="You" />
                
                {/* Other students */}
                {peers.filter(p => p.userType !== 'teacher').map((peer, index) => (
                  <VideoCard key={index} peer={peer.peer} userName={peer.userName} />
                ))}
              </div>
            </div>
          ) : (
            // Teacher view: Equal grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full content-start">
              {/* Local Video */}
              <VideoCard isLocal={true} stream={stream} userName="You" />
              
              {/* Remote Videos */}
              {peers.map((peer, index) => (
                <VideoCard key={index} peer={peer.peer} userName={peer.userName} />
              ))}
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-16 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center gap-2 px-6 z-20 shadow-2xl">
          <button 
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-all duration-300 ${isAudioEnabled ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500/20 border border-red-500 text-red-500'}`}
            title={isAudioEnabled ? "Mute" : "Unmute"}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button 
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all duration-300 ${isVideoEnabled ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500/20 border border-red-500 text-red-500'}`}
            title={isVideoEnabled ? "Stop Video" : "Start Video"}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          
          <button 
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-all duration-300 ${isScreenSharing ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            title="Share Screen"
          >
            <Monitor size={20} />
          </button>

          <button 
            onClick={() => setCaptionsEnabled(!captionsEnabled)}
            className={`p-3 rounded-full transition-all duration-300 ${captionsEnabled ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            title="Toggle Captions"
          >
            <Subtitles size={20} />
          </button>
          
          <div className="w-px h-8 bg-gray-700 mx-2" />
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-all duration-300 ${showChat ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            title="Chat"
          >
            <MessageSquare size={20} />
            {newMessage && !showChat && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(244,63,94,0.6)]" />}
          </button>
          
          <button 
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-3 rounded-full transition-all duration-300 ${showParticipants ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            title="Participants"
          >
            <Users size={20} />
          </button>

          <button 
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-3 rounded-full transition-all duration-300 ${showWhiteboard ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            title="Whiteboard"
          >
            <Presentation size={20} />
          </button>

          {user.role === 'student' && (
            <button 
              onClick={toggleRaiseHand}
              className={`p-3 rounded-full transition-all duration-300 ${isHandRaised ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-bounce' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              title={isHandRaised ? "Lower Hand" : "Raise Hand"}
            >
              <Hand size={20} />
            </button>
          )}

          {user.role === 'teacher' && raisedHands.length > 0 && (
            <button 
              onClick={lowerAllHands}
              className="p-3 rounded-full bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-300 relative"
              title="Lower All Hands"
            >
              <Hand size={20} />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {raisedHands.length}
              </span>
            </button>
          )}

          <div className="w-px h-8 bg-slate-700 mx-2" />
          
          <button 
            onClick={leaveClass}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-300"
            title="Leave Class"
          >
            <Phone size={20} className="rotate-[135deg]" />
          </button>
        </div>
      </div>

      {/* Sidebar (Chat/Participants) */}
      {(showChat || showParticipants) && (
        <div className="w-80 bg-slate-900/90 backdrop-blur-xl border-l border-slate-700 flex flex-col transition-all duration-300 z-30 shadow-2xl relative">
          <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
            <h2 className="font-bold text-slate-200 tracking-wide text-sm flex items-center gap-2">
              {showChat ? <MessageSquare size={16} className="text-indigo-400" /> : <Users size={16} className="text-purple-400" />}
              {showChat ? 'Class Chat' : 'Participants'}
            </h2>
            <button 
              onClick={() => { setShowChat(false); setShowParticipants(false); }}
              className="text-slate-500 hover:text-slate-300 bg-slate-800 hover:bg-slate-700 p-1 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {showChat && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => {
                  console.log('Message:', msg.userId, 'Current User:', user._id, 'Match:', msg.userId?.toString() === user._id?.toString());
                  const isMyMessage = msg.userId?.toString() === user._id?.toString();
                  return (
                  <div key={idx} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-xs font-semibold ${isMyMessage ? 'text-indigo-400' : 'text-purple-400'}`}>
                        {isMyMessage ? 'You' : msg.userName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`px-4 py-2.5 max-w-[90%] text-sm shadow-sm ${
                      isMyMessage 
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 bg-slate-900">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </>
          )}

          {showParticipants && (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded bg-cyan-900/20 border border-cyan-500/30">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.fullName} (You)</p>
                    <p className="text-[10px] text-cyan-500">{user.role.toUpperCase()}</p>
                  </div>
                  <Mic size={14} className="text-green-500" />
                </div>
                
                {peers.map((peer, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-colors">
                    <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs relative">
                      {peer.userName?.charAt(0) || '?'}
                      {raisedHands.some(h => h.userId === peer.userId) && (
                        <span className="absolute -top-1 -right-1 text-orange-500 animate-bounce">
                          ✋
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        {peer.userName || 'Unknown User'}
                        {raisedHands.some(h => h.userId === peer.userId) && (
                          <span className="text-orange-500 text-xs animate-pulse">✋</span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500">{peer.userType?.toUpperCase() || 'PARTICIPANT'}</p>
                    </div>
                    {user.role === 'teacher' && peer.userType === 'student' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => muteStudent(peer.peerID)}
                          className="p-1 text-orange-500 hover:bg-orange-500/20 rounded"
                          title="Mute Student"
                        >
                          <VolumeX size={14} />
                        </button>
                        <button 
                          onClick={() => turnOffStudentVideo(peer.peerID)}
                          className="p-1 text-blue-500 hover:bg-blue-500/20 rounded"
                          title="Turn Off Camera"
                        >
                          <VideoOff size={14} />
                        </button>
                        <button 
                          onClick={() => markAttendance(peer.userId, true)}
                          className="p-1 text-green-500 hover:bg-green-500/20 rounded"
                          title="Mark Present"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          onClick={() => markAttendance(peer.userId, false)}
                          className="p-1 text-red-500 hover:bg-red-500/20 rounded"
                          title="Mark Absent"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Whiteboard Modal */}
      {showWhiteboard && (
        <div className="fixed inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-center p-4 bg-slate-800/80 border-b border-slate-700 backdrop-blur-md z-10">
              <h2 className="text-indigo-400 font-bold tracking-wide flex items-center gap-2">
                <Presentation size={18} />
                Virtual Whiteboard
              </h2>
              <button
                onClick={() => setShowWhiteboard(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-white relative">
              <Whiteboard socket={socketRef.current} classId={classId} isTeacher={user.role === 'teacher'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualClass;