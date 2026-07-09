import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Video, Info, Image, Heart, Send, Smile, ChevronLeft, Check, CheckCircle2 } from 'lucide-react';
import { DirectChat, User } from '../types';

interface DirectPageProps {
  currentUser: User;
  chats: DirectChat[];
  onSendMessage: (chatId: string, text: string, senderId: string) => void;
  onReceiveReply?: (chatId: string, text: string) => void;
}

export default function DirectPage({ currentUser, chats, onSendMessage, onReceiveReply }: DirectPageProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chats[0]?.id || null);
  const [typedMessage, setTypedMessage] = useState('');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Reply simulation prompts
  const SIMULATED_REPLIES: { [username: string]: string[] } = {
    elena_wild: [
      "That sounds great! I was looking up some landscape photo ideas for Yosemite too 📸",
      "Let's definitely do a sunrise shoot near El Capitan. The morning fog is unreal!",
      "I can bring my wide-angle lens so you can borrow it! What focal lengths do you have right now?",
      "Sweet! Let's schedule a quick call tomorrow to plan the details 🗺️"
    ],
    cafe_minimal: [
      "Thanks! I just dropped it off at DHL. It should be arriving by Thursday afternoon ✈️☕",
      "The custom print came out beautifully on our fine-art matte paper. Let me know how it looks on your wall!",
      "If you ever need more prints or some specialty espresso beans from Tokyo, just write me here!",
      "Appreciate the support Sam! 🙌 Have a fantastic week."
    ],
    'sophia.art': [
      "Oh, thank you Sam! That sunset really was a masterclass in colors 🌅",
      "I'm working on a new canvas right now. Trying out some palette knife textures this time!",
      "I'm hoping to do a studio showcase in San Francisco later this year. I'd love to have you drop by!",
      "Have a creative and beautiful day! ✨"
    ]
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatId) return;

    const messageText = typedMessage.trim();
    onSendMessage(activeChatId, messageText, currentUser.id);
    setTypedMessage('');

    // Trigger simulated reply after a tiny typing break!
    setIsTyping(true);
    const participantUsername = activeChat?.participant.username || '';
    const replies = SIMULATED_REPLIES[participantUsername] || [
      "That's awesome! Let's talk more about this later 👍",
      "Wow, interesting! Tell me more about it.",
      "Haha love that! 😂",
      "Sounds like a plan!"
    ];

    // Pick a reply or cycle them
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      setIsTyping(false);
      if (onReceiveReply) {
        onReceiveReply(activeChatId, randomReply);
      }
    }, 2000);
  };

  const handleSendDirectHeart = () => {
    if (!activeChatId) return;
    onSendMessage(activeChatId, '❤️', currentUser.id);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (onReceiveReply) {
        onReceiveReply(activeChatId, '🙌❤️');
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-[950px] mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-40px)] border border-zinc-800 rounded-xl overflow-hidden bg-black flex transition-colors shadow-sm select-none">
      
      {/* List Panel */}
      <div className={`w-full md:w-[350px] border-r border-zinc-800 flex flex-col ${isMobileDetailOpen ? 'hidden md:flex' : 'flex'}`}>
        
        {/* List Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-bold text-sm tracking-wide text-white">{currentUser.username}</span>
            <span className="text-xs text-zinc-500">▼</span>
          </div>
          
          <button className="text-white hover:opacity-85 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Conversation List Filters */}
        <div className="flex gap-4 px-5 py-2.5 text-xs font-semibold text-zinc-500 select-none">
          <button className="text-white border-b border-white pb-1.5">Primary</button>
          <button className="hover:text-zinc-300 pb-1.5">General</button>
          <button className="hover:text-zinc-300 pb-1.5">Requests (0)</button>
        </div>

        {/* Chat Threads scrolling area */}
        <div className="flex-grow overflow-y-auto">
          {chats.map((chat) => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isUnread = lastMsg && lastMsg.senderId !== currentUser.id; // Simulate unread state
            const isActive = chat.id === activeChatId;

            return (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setIsMobileDetailOpen(true);
                }}
                className={`w-full flex items-center gap-3.5 px-5 py-3 hover:bg-zinc-900 transition-colors text-left focus:outline-none ${isActive ? 'bg-zinc-900/40' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img src={chat.participant.avatar} alt={chat.participant.username} className="w-full h-full object-cover" />
                  </div>
                  {chat.participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full" />
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${isUnread ? 'font-bold text-white' : 'font-semibold text-zinc-200'}`}>
                      {chat.participant.username}
                    </span>
                    {chat.participant.isOnline && (
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-xs truncate ${isUnread ? 'font-bold text-white' : 'text-zinc-500'}`}>
                    {lastMsg ? lastMsg.text : 'Start a conversation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Chat Stage Panel */}
      <div className={`flex-grow h-full flex flex-col bg-black transition-colors ${!isMobileDetailOpen ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                {/* Back button on mobile */}
                <button 
                  onClick={() => setIsMobileDetailOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white md:hidden mr-1"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img src={activeChat.participant.avatar} alt={activePostUsername(activeChat?.participant.username)} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-white">
                      {activeChat.participant.username}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 leading-none">
                    {activeChat.participant.isOnline ? 'Active now' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-200">
                <button className="hover:opacity-75 transition-opacity"><Phone className="w-5 h-5" /></button>
                <button className="hover:opacity-75 transition-opacity"><Video className="w-5 h-5" /></button>
                <button className="hover:opacity-75 transition-opacity"><Info className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Bubble History stream */}
            <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-3.5 scrollbar-thin">
              {activeChat.messages.map((msg, index) => {
                const isMine = msg.senderId === currentUser.id;
                const nextMsg = activeChat.messages[index + 1];
                const isSequential = nextMsg && nextMsg.senderId === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] ${isMine ? 'self-end items-end' : 'self-start items-start'} ${isSequential ? 'mb-1' : 'mb-3'}`}
                  >
                    <div
                      className={`px-4 py-2.5 text-xs rounded-2xl select-text transition-colors duration-150 ${
                        isMine
                          ? 'bg-[#0095f6] text-white rounded-br-sm'
                          : 'bg-zinc-900 text-white rounded-bl-sm border border-zinc-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {!isSequential && (
                      <span className="text-[9px] text-zinc-500 mt-1 px-1">
                        {msg.createdAt}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Character Typing Effect simulator */}
              {isTyping && (
                <div className="self-start flex flex-col items-start gap-1">
                  <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 italic px-1">Typing...</span>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Input message form composition */}
            <div className="p-4 border-t border-zinc-900 bg-black transition-colors">
              <form onSubmit={handleSend} className="flex items-center gap-3 border border-zinc-800 rounded-full px-4 py-2.5 bg-zinc-950 focus-within:border-zinc-700 transition-colors">
                <button type="button" className="text-zinc-500 hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-grow bg-transparent text-xs text-white focus:outline-none placeholder:text-zinc-600"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />

                {typedMessage.trim() ? (
                  <button type="submit" className="text-[#0095f6] hover:text-[#1877f2] font-semibold text-xs transition-colors">
                    Send
                  </button>
                ) : (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <button type="button" className="hover:opacity-75 transition-opacity">
                      <Image className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={handleSendDirectHeart} className="hover:scale-110 active:scale-95 text-rose-500 hover:text-rose-600 transition-transform">
                      <Heart className="w-5 h-5 fill-rose-500" />
                    </button>
                  </div>
                )}
              </form>
            </div>
          </>
        ) : (
          /* Empty Chat Splash screen state */
          <div className="flex-grow flex flex-col items-center justify-center p-8 select-none bg-black">
            <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white">Your Messages</h2>
            <p className="text-xs text-zinc-500 text-center mt-1.5 max-w-[280px]">
              Send private photos, videos and messages to a close friend or group.
            </p>
            <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold px-4 py-2 rounded-lg mt-5 shadow-sm transition-colors">
              Send Message
            </button>
          </div>
        )}
      </div>

    </div>
  );

  function activePostUsername(v: string) {
    return v;
  }
}
