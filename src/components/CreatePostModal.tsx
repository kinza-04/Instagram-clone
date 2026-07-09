import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, MapPin, Check, Smile, Sparkles } from 'lucide-react';
import { User, Post } from '../types';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onPostCreated: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
}

const STOCK_OPTIONS = [
  { name: 'Fuji Autumn', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
  { name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop&q=80' },
  { name: 'Cozy Espresso', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Oahu Surfer', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80' }
];

const FILTERS = [
  { name: 'Normal', filter: 'contrast(100%)' },
  { name: 'Clarendon', filter: 'contrast(120%) saturate(125%)' },
  { name: 'Lark', filter: 'brightness(110%) saturate(95%) contrast(110%)' },
  { name: 'Juno', filter: 'sepia(20%) saturate(150%) contrast(110%) brightness(105%)' },
  { name: 'Ludwig', filter: 'contrast(105%) saturate(110%) hue-rotate(-10deg)' },
  { name: 'Grayscale', filter: 'grayscale(100%) contrast(115%)' }
];

export default function CreatePostModal({ currentUser, onClose, onPostCreated }: CreatePostModalProps) {
  const [step, setStep] = useState(1); // 1: Select, 2: Filter, 3: Share Write, 4: Sharing Progress
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Drag and drop image selector
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    setStep(4);
    setTimeout(() => {
      onPostCreated({
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        imageUrl,
        filterClass: selectedFilter.filter,
        caption: caption.trim(),
        location: location.trim() || undefined,
        isVerified: currentUser.isVerified,
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="relative bg-black rounded-xl w-full max-w-[700px] h-[500px] flex flex-col shadow-2xl overflow-hidden border border-zinc-800 z-10 transition-colors">
        
        {/* Navigation Modal Topbar */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-900 bg-black text-white z-20">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors"
            >
              Back
            </button>
          ) : (
            <div className="w-8" />
          )}

          <h2 className="text-sm font-semibold tracking-wide">
            {step === 1 && 'Create new post'}
            {step === 2 && 'Apply Filter'}
            {step === 3 && 'Write Caption'}
            {step === 4 && 'Sharing...'}
          </h2>

          {step < 3 ? (
            imageUrl ? (
              <button
                onClick={() => setStep(3)}
                className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors"
              >
                Next
              </button>
            ) : (
              <div className="w-8" />
            )
          ) : step === 3 ? (
            <button
              onClick={handleShare}
              className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors animate-pulse"
            >
              Share
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Modal Core Stages Viewport */}
        <div className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* STEP 1: SELECT SOURCE */}
          {step === 1 && (
            <div 
              className={`flex-grow flex flex-col items-center justify-center p-8 text-center relative ${dragActive ? 'bg-zinc-900/60' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-24 h-24 text-zinc-500 mb-4 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
                <ImageIcon className="w-10 h-10" />
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">
                Drag photos and videos here
              </h3>
              <p className="text-xs text-zinc-500 mb-4 max-w-[280px]">
                Support PNG, JPG formats, or write/select presets.
              </p>

              {/* Standard Hidden File Upload Trigger */}
              <label className="bg-[#0095f6] hover:bg-[#1877f2] active:bg-[#0082fb] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm mb-6">
                Select from computer
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {/* URL Access option */}
              <div className="flex flex-col gap-2 w-full max-w-[320px] mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] bg-zinc-900 flex-grow" />
                  <span className="text-[10px] text-zinc-500 font-medium">OR ENTER IMAGE URL</span>
                  <div className="h-[1px] bg-zinc-900 flex-grow" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    className="flex-grow bg-zinc-900 text-white text-xs px-3 py-2 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button
                    onClick={() => imageUrl.trim() && setStep(2)}
                    className="bg-zinc-900 border border-zinc-800 text-xs font-bold px-3 py-2 rounded hover:bg-zinc-800 text-white"
                  >
                    Go
                  </button>
                </div>
              </div>

              {/* Preset Stock Options for fast loading and visual testing */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> Choose Quick Demo Preset
                </span>
                <div className="flex gap-2.5">
                  {STOCK_OPTIONS.map((stock) => (
                    <button
                      key={stock.name}
                      onClick={() => {
                        setImageUrl(stock.url);
                        setStep(2);
                      }}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 group-hover:scale-105 transition-transform bg-zinc-900">
                        <img src={stock.url} alt={stock.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] text-zinc-500 font-medium">{stock.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: APPLY FILTER EFFECTS */}
          {step === 2 && (
            <div className="flex-grow flex flex-col md:flex-row h-full">
              {/* Image Container */}
              <div className="w-full md:w-[60%] h-[260px] md:h-full bg-black flex items-center justify-center p-2 relative">
                <img
                  src={imageUrl}
                  alt="Draft post"
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: selectedFilter.filter }}
                />
              </div>

              {/* Filters list Selector panel */}
              <div className="w-full md:w-[40%] bg-black p-5 border-t md:border-t-0 md:border-l border-zinc-900 overflow-y-auto">
                <h3 className="text-xs font-bold text-zinc-500 mb-4 select-none">FILTER EFFECTS</h3>
                <div className="grid grid-cols-3 gap-3">
                  {FILTERS.map((filt) => {
                    const isActive = selectedFilter.name === filt.name;
                    return (
                      <button
                        key={filt.name}
                        onClick={() => setSelectedFilter(filt)}
                        className={`flex flex-col items-center gap-2 p-1.5 rounded-lg border transition-colors ${
                          isActive
                            ? 'border-[#0095f6] bg-[#0095f6]/10'
                            : 'border-zinc-800 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="w-14 h-14 rounded overflow-hidden bg-zinc-900 relative">
                          <img
                            src={imageUrl}
                            alt="Filter preview"
                            className="w-full h-full object-cover"
                            style={{ filter: filt.filter }}
                          />
                        </div>
                        <span className={`text-[10px] ${isActive ? 'font-bold text-[#0095f6]' : 'text-zinc-500'}`}>
                          {filt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CAPTION & DETAILS FOR INGESTION */}
          {step === 3 && (
            <div className="flex-grow flex flex-col md:flex-row h-full">
              {/* Image Preview Stage */}
              <div className="hidden md:flex w-[50%] h-full bg-black items-center justify-center p-2">
                <img
                  src={imageUrl}
                  alt="Post preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: selectedFilter.filter }}
                />
              </div>

              {/* Data Ingestion form */}
              <div className="w-full md:w-[50%] p-5 flex flex-col justify-between bg-black text-white">
                <div className="flex flex-col gap-5">
                  {/* Active identity card */}
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full border border-zinc-800 object-cover"
                    />
                    <span className="font-semibold text-xs">{currentUser.username}</span>
                  </div>

                  {/* Caption Editor input */}
                  <textarea
                    placeholder="Write a caption..."
                    rows={4}
                    className="w-full bg-transparent text-xs outline-none border-none focus:ring-0 resize-none font-sans"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                  />

                  {/* Location field */}
                  <div className="flex items-center gap-2 border-t border-b border-zinc-900 py-3">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Add location"
                      className="w-full bg-transparent text-xs outline-none focus:ring-0 border-none font-sans placeholder:text-zinc-500"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Caption metrics indicators */}
                <div className="flex justify-between items-center text-[10px] text-zinc-500 select-none">
                  <button type="button" className="hover:text-white transition-colors">
                    <Smile className="w-4.5 h-4.5" />
                  </button>
                  <span>{caption.length}/2,200</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SHARING INTERACTIVE PROGRESS */}
          {step === 4 && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-black select-none text-white">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-24 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
              </motion.div>
              <h3 className="text-base font-bold mb-1">Your post is shared!</h3>
              <p className="text-xs text-zinc-500">Adding to feed and updating profile...</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
