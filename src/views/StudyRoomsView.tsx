import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { StudyRoomItem, RoomStatus } from '../types/sessionRoom';
import { sessionRoomService } from '../services/sessionRoomService';
import { User } from '../types/user';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Clock,
  MessageSquare,
  Flame,
  Radio,
  Send,
  Brain,
  Calendar,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ChevronLeft,
  Video,
  Filter,
  Search,
} from 'lucide-react';

export interface StudyRoomsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  activeRoomId?: string;
}

export const StudyRoomsView: React.FC<StudyRoomsViewProps> = ({
  currentUser,
  onNavigate,
  activeRoomId,
}) => {
  const [rooms, setRooms] = useState<StudyRoomItem[]>(() => sessionRoomService.getStudyRooms());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(activeRoomId || null);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RoomStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active room state (when entered inside a room)
  const [isInsideRoom, setIsInsideRoom] = useState<boolean>(!!activeRoomId);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [activeSound, setActiveSound] = useState<'rain' | 'lofi' | 'library' | 'off'>('lofi');
  const [notes, setNotes] = useState(
    '• Focus Sprint Goal: Solve 5 Master Method problems\n• Key Point: In QuickSort partition, keep pivot placement stable.\n• Check BST in-order traversal yields strictly ascending order.'
  );
  const [chatMessages, setChatMessages] = useState([
    { user: 'Om Tajane', role: 'Admin Host', text: 'Welcome everyone! Today we are tackling algorithmic time complexity proofs and sorting invariants. 🚀', time: '06:00 PM' },
    { user: 'Aryan Sharma', role: 'Student', text: 'Working on Problem #3 from the DSA Searching & Sorting 40-page notes!', time: '06:05 PM' },
    { user: 'Aditi Sen', role: 'Student', text: 'Partition boundary logic makes so much sense now. 💡', time: '06:12 PM' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    setRooms(sessionRoomService.getStudyRooms());
  }, []);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Check participation status
  useEffect(() => {
    if (currentUser && activeRoom) {
      const participating = sessionRoomService.isStudentParticipating(currentUser.id, activeRoom.id);
      setIsJoined(participating);
    }
  }, [currentUser, activeRoom, selectedRoomId]);

  // Pomodoro countdown timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0 && isInsideRoom) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, isInsideRoom]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJoinToggle = (room: StudyRoomItem) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    if (isJoined) {
      sessionRoomService.leaveTarget(currentUser.id, { roomId: room.id });
      setIsJoined(false);
      setRooms(sessionRoomService.getStudyRooms());
    } else {
      sessionRoomService.joinTarget(
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          college: currentUser.college,
        },
        { roomId: room.id }
      );
      setIsJoined(true);
      setRooms(sessionRoomService.getStudyRooms());
    }
  };

  const handleEnterRoom = (room: StudyRoomItem) => {
    setSelectedRoomId(room.id);
    setIsInsideRoom(true);
    if (currentUser && !sessionRoomService.isStudentParticipating(currentUser.id, room.id)) {
      handleJoinToggle(room);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const senderName = currentUser ? currentUser.name : 'Guest Student';
    const senderRole = currentUser?.role === 'admin' ? 'Admin Host' : 'Student';
    setChatMessages((prev) => [
      ...prev,
      {
        user: senderName,
        role: senderRole,
        text: newMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMsg('');
  };

  // Subjects list
  const subjects = ['ALL', ...Array.from(new Set(rooms.map((r) => r.subject)))];

  const filteredRooms = rooms.filter((r) => {
    const matchSubject = selectedSubject === 'ALL' || r.subject === selectedSubject;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchStatus && matchSearch;
  });

  // PARTICIPANTS LIST for the active room
  const participants = activeRoom ? sessionRoomService.getParticipantsForTarget(activeRoom.id) : [];

  // ====================== IF INSIDE ACTIVE ROOM ======================
  if (isInsideRoom && activeRoom) {
    return (
      <div id="study-room-active-canvas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Back and Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setIsInsideRoom(false)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to All Study Rooms</span>
          </button>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                activeRoom.status === 'LIVE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : activeRoom.status === 'UPCOMING'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {activeRoom.status === 'LIVE' && <Radio className="w-3.5 h-3.5" />}
              <span>{activeRoom.status} Room</span>
            </span>

            {activeRoom.liveSessionUrl && (
              <a
                href={activeRoom.liveSessionUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Live Stream</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}

            <button
              onClick={() => handleJoinToggle(activeRoom)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isJoined
                  ? 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-slate-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {isJoined ? 'Leave Room' : 'Join Room'}
            </button>
          </div>
        </div>

        {/* Room Header Info */}
        <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                {activeRoom.subject}
              </span>
              <span className="text-xs text-slate-400">• {activeRoom.topic}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
              {activeRoom.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeRoom.description}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 shrink-0">
            <UserInitialsBadge name={activeRoom.hostName} role="admin" size="md" />
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> YuvaSetu Host
              </span>
              <p className="text-xs font-bold text-white">{activeRoom.hostName}</p>
              <p className="text-[10px] text-slate-400">Scheduled: {activeRoom.startTime} ({activeRoom.duration})</p>
            </div>
          </div>
        </div>

        {/* WORKSPACE: Timer (Col 1-8) & Chat/Participants (Col 9-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Timer & Scratchpad */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-6">
              {/* Pomodoro Clock */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Synchronized Focus Sprint (25m / 5m)</span>
                </div>

                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-lg">
                  {formatTime(secondsRemaining)}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-extrabold shadow-md hover:opacity-90 transition-all cursor-pointer"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause Sprint' : 'Resume Sprint'}</span>
                  </button>
                  <button
                    onClick={() => setSecondsRemaining(25 * 60)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Reset 25 mins"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Ambient Sound Selection */}
                <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] mr-1">Ambient Soundscape:</span>
                  {[
                    { id: 'lofi' as const, label: '🎧 Lofi Focus' },
                    { id: 'rain' as const, label: '🌧️ Monsoon Rain' },
                    { id: 'library' as const, label: '📚 Quiet Library' },
                    { id: 'off' as const, label: '🔇 Mute' },
                  ].map((snd) => (
                    <button
                      key={snd.id}
                      onClick={() => setActiveSound(snd.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        activeSound === snd.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {snd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synchronized Scratchpad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Brain className="w-3.5 h-3.5" /> Personal Study Scratchpad & Milestone Notes
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-saved to local session</span>
                </div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your derivations, formulas, or key breakthroughs here..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Chat & Live Attendees */}
          <div className="lg:col-span-4 space-y-6">
            {/* Peer Focus Chat */}
            <div className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 flex flex-col h-[400px] justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Focus Q&A & Milestones
                </span>
                <span className="text-[10px] text-slate-400">Quiet Protocol</span>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{msg.user}</span>
                        {msg.role === 'Admin Host' ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-black border border-rose-500/30">
                            Host
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">
                            Student
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-slate-200 text-xs">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Share a milestone or ask doubt..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Active Attendees / Room Participants (No profile pictures, only text & initials) */}
            <div className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Active Participants
                </span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {participants.length || activeRoom.activeParticipants} Online
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <UserInitialsBadge name={p.studentName} size="xs" showOnlineDot={true} />
                        <div>
                          <p className="font-bold text-slate-200 text-xs">{p.studentName}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {p.college || 'YuvaSetu Student'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">Joined</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No active student records. Join to be first!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================== DEFAULT: STUDY ROOMS LISTING ======================
  return (
    <div id="yuvasetu-study-rooms-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER WITH BRAND IDENTITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#150d26] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <YuvaSetuLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Study Rooms
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Learn together with focused sessions organized by YuvaSetu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>{rooms.reduce((acc, r) => acc + (r.activeParticipants || 0), 0)} Students In Rooms</span>
          </span>

          <button
            onClick={() => onNavigate('live_sessions')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>View Live Sessions</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="p-4 rounded-2xl bg-[#0c1020] border border-slate-800/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search study rooms by topic, subject or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'LIVE', 'UPCOMING', 'ENDED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Rooms' : st}
            </button>
          ))}
        </div>
      </div>

      {/* SUBJECT PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sub === 'ALL' ? 'All Subjects' : sub}
          </button>
        ))}
      </div>

      {/* ROOMS GRID */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const isRoomLive = room.status === 'LIVE';
            const isRoomUpcoming = room.status === 'UPCOMING';
            const isRoomEnded = room.status === 'ENDED';
            const isRoomCancelled = room.status === 'CANCELLED';

            return (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className="group relative p-6 rounded-3xl bg-[#0c1020] hover:bg-[#0f1528] border border-slate-800 hover:border-cyan-500/40 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/20 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Status & Subject */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                      {room.subject}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isRoomLive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : isRoomUpcoming
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isRoomLive && <Radio className="w-3 h-3" />}
                      <span>{room.status}</span>
                    </span>
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <h3 className="text-base font-bold font-['Outfit'] text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{room.topic}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-800/80">
                  {/* Host & Meta Info (Names as text and initials badge, NO photos) */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <UserInitialsBadge name={room.hostName} role="admin" size="xs" />
                      <div>
                        <span className="text-[10px] text-slate-500 block leading-none">Host / Admin</span>
                        <span className="text-xs font-bold text-slate-200">{room.hostName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block leading-none">Active</span>
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {room.activeParticipants} Peers
                      </span>
                    </div>
                  </div>

                  {/* Scheduled time info */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{room.startTime}</span>
                    <span className="text-slate-600">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{room.duration}</span>
                  </div>

                  {/* Action Button */}
                  {isRoomLive ? (
                    <button
                      onClick={() => handleEnterRoom(room)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Join Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isRoomUpcoming ? (
                    <button
                      onClick={() => handleEnterRoom(room)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isRoomEnded ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                    >
                      Session Ended
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-600 text-xs font-semibold cursor-not-allowed"
                    >
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#0c1020] border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No study rooms match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or subject selection.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
