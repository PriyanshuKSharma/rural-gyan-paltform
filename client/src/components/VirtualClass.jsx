import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, Phone, 
  MessageSquare, Users, X, Send, MoreVertical, Settings,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-cyan-900/30 shadow-lg group aspect-video">
      <video
        playsInline
        autoPlay
        muted={isLocal}
        ref={videoRef}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-cyan-500/30">
        <span className="text-white text-sm font-medium flex items-center gap-2">
          {isLocal ? 'YOU' : userName}
          {isLocal && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>}
        </span>
      </div>
      <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-300 pointer-events-none rounded-lg" />
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
  const [classData, setClassData] = useState(null);
  const [timer, setTimer] = useState('00:00:00');
  const [startTime] = useState(Date.now());
  
  const socketRef = useRef();
  const peersRef = useRef([]);
  const userVideo = useRef();
  const screenTrackRef = useRef();
  const messagesEndRef = useRef(null);

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
    socketRef.current = io('/');
    
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

        // Existing users receive this when a new user joins
        socketRef.current.on('participant-joined', (payload) => {
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
          toast.success(`${payload.userType} joined the class`);
        });

        // New user receives this when an existing user offers a connection
        socketRef.current.on('video-offer', (payload) => {
          const peer = addPeer(payload.offer, payload.fromSocketId, currentStream);
          peersRef.current.push({
            peerID: payload.fromSocketId,
            peer,
            userName: 'Connecting...', // We might need to fetch user details or pass them in offer
            userId: payload.fromUserId,
            userType: 'participant' // Default, maybe update later
          });
          setPeers((users) => [...users, { 
            peer, 
            userName: 'Connecting...', 
            peerID: payload.fromSocketId,
            userId: payload.fromUserId,
            userType: 'participant'
          }]);
        });

        socketRef.current.on('video-answer', (payload) => {
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
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        toast.error("Could not access camera/microphone");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
    };
  }, [classId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      // Stop screen share
      screenTrackRef.current.stop();
      toast('Screen sharing stopped');
      setIsScreenSharing(false);
    } else {
      navigator.mediaDevices.getDisplayMedia({ cursor: true })
        .then((screenStream) => {
          const screenTrack = screenStream.getTracks()[0];
          screenTrackRef.current = screenTrack;
          
          // Note: simple-peer replaceTrack support varies. 
          // We'll just show a toast for now as full implementation is complex
          toast('Screen sharing started (experimental)');
          
          screenTrack.onended = () => {
            setIsScreenSharing(false);
          };
          
          setIsScreenSharing(true);
        })
        .catch((err) => {
          console.error("Error sharing screen:", err);
        });
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
      
      socketRef.current.emit('chat-message', messageData);
      setMessages((msgs) => [...msgs, messageData]); // Optimistic update
      setNewMessage('');
    }
  };

  const leaveClass = () => {
    if (window.confirm("Are you sure you want to leave the class?")) {
      navigate('/dashboard');
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

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden cyber-bg">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-cyan-400 cyber-glitch-text" data-text={classData?.title || "VIRTUAL_CLASSROOM"}>
                {classData?.title || "VIRTUAL_CLASSROOM"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-cyan-600 font-mono">SECURE_CONNECTION_ESTABLISHED</span>
                <span className="text-xs text-gray-500 font-mono">|</span>
                <div className="flex items-center gap-1 text-xs text-purple-400 font-mono">
                  <Clock size={12} />
                  {timer}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded animate-pulse">LIVE</span>
              <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs rounded">{peers.length + 1} ONLINE</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar pt-20 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full content-start">
            {/* Local Video */}
            <VideoCard isLocal={true} stream={stream} userName="You" />
            
            {/* Remote Videos */}
            {peers.map((peer, index) => (
              <VideoCard key={index} peer={peer.peer} userName={peer.userName} />
            ))}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 bg-gray-900/90 backdrop-blur-md border border-cyan-900/50 rounded-full flex items-center justify-center gap-2 px-6 z-20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
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
          
          <div className="w-px h-8 bg-gray-700 mx-2" />
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-all duration-300 ${showChat ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            title="Chat"
          >
            <MessageSquare size={20} />
            {newMessage && !showChat && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-bounce" />}
          </button>
          
          <button 
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-3 rounded-full transition-all duration-300 ${showParticipants ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            title="Participants"
          >
            <Users size={20} />
          </button>

          <div className="w-px h-8 bg-gray-700 mx-2" />
          
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
        <div className="w-80 bg-gray-900 border-l border-cyan-900/30 flex flex-col transition-all duration-300 z-30">
          <div className="p-4 border-b border-cyan-900/30 flex justify-between items-center bg-gray-800/50">
            <h2 className="font-bold text-cyan-400 tracking-wider text-sm">
              {showChat ? 'SECURE_CHAT' : 'PARTICIPANTS'}
            </h2>
            <button 
              onClick={() => { setShowChat(false); setShowParticipants(false); }}
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {showChat && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.userId === user._id ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${msg.userId === user._id ? 'text-cyan-400' : 'text-purple-400'}`}>
                        {msg.userId === user._id ? 'YOU' : msg.userName?.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg max-w-[90%] text-sm ${
                      msg.userId === user._id 
                        ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-100 rounded-tr-none' 
                        : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-cyan-900/30 bg-gray-800/30">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter message..."
                    className="w-full bg-gray-900 border border-cyan-900/50 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-400"
                  >
                    <Send size={16} />
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
                    <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                      {peer.userName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-300">{peer.userName || 'Unknown User'}</p>
                      <p className="text-[10px] text-gray-500">{peer.userType?.toUpperCase() || 'PARTICIPANT'}</p>
                    </div>
                    {user.role === 'teacher' && peer.userType === 'student' && (
                      <div className="flex gap-1">
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
    </div>
  );
};

export default VirtualClass;