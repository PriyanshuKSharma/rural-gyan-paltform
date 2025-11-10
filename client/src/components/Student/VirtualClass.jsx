import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Hand, MessageCircle, Phone } from 'lucide-react';

const VirtualClass = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  return (
    <div className="h-full bg-gray-900 rounded-2xl overflow-hidden">
      {/* Video Area */}
      <div className="relative h-3/4 bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <Video size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Mathematics Class</p>
            <p className="text-sm opacity-75">Teacher: Dr. Smith • Class 10A</p>
          </div>
        </div>
        
        {/* Teacher Video */}
        <div className="absolute top-4 left-4">
          <div className="w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">Dr. Smith (Teacher)</span>
          </div>
        </div>

        {/* Your Video */}
        <div className="absolute bottom-4 right-4">
          <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">You</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-1/4 bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-600' : 'bg-red-600'} text-white hover:opacity-80 transition-opacity`}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-600' : 'bg-red-600'} text-white hover:opacity-80 transition-opacity`}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button
            onClick={() => setHandRaised(!handRaised)}
            className={`p-3 rounded-full ${handRaised ? 'bg-yellow-600' : 'bg-gray-600'} text-white hover:opacity-80 transition-opacity`}
          >
            <Hand size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">
            <MessageCircle size={16} />
            <span>Chat</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            <Phone size={16} />
            <span>Leave Class</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualClass;