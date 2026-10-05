import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Share2,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import { UserInitialsBadge } from './UserInitialsBadge';

export interface CommunityProps {
  onJoinCommunity: () => void;
  onOpenStudyRooms: () => void;
  onOpenDoubts: () => void;
}

export const Community: React.FC<CommunityProps> = ({
  onJoinCommunity,
  onOpenStudyRooms,
  onOpenDoubts,
}) => {
  const [activeTab, setActiveTab] = useState<'doubts' | 'study_rooms' | 'toppers'>('doubts');

  const communityDiscussions = [
    {
      id: 'comm-1',
      studentName: 'Aryan Sharma',
      college: 'IIT Bombay • CSE',
      badge: 'Peer Topper',
      topic: 'Dijkstra vs Bellman-Ford Negative Cycle Detection',
      comment:
        'Uploaded the 4-page handnote summary on why Dijkstra fails with negative edges. Remember: greedy edge relaxation assumes paths only lengthen!',
      likes: 142,
      replies: 18,
      time: '20 mins ago',
      tags: ['Algorithms', 'Exam Prep'],
    },
    {
      id: 'comm-2',
      studentName: 'Meera Iyer',
      college: 'DTU Delhi • Chemistry',
      badge: 'Active Contributor',
      topic: 'Organic Aldol Condensation Shortcut',
      comment:
        'Just added step-by-step mechanism breakdown for E-enone vs Z-enone. Cleared doubt for 40+ classmates studying for tomorrow’s mid-sem!',
      likes: 89,
      replies: 12,
      time: '45 mins ago',
      tags: ['Chemistry', 'Reaction Mechanisms'],
    },
    {
      id: 'comm-3',
      studentName: 'Kunal Deshmukh',
      college: 'BITS Pilani • Mechanical',
      badge: 'Study Room Host',
      topic: 'Late Night Fluid Mechanics Pomodoro Room',
      comment:
        'Host of Room #4: 65 students completed three 25-minute sprints on Navier-Stokes boundary equations. Join the next sprint at 10 PM!',
      likes: 210,
      replies: 34,
      time: '1 hour ago',
      tags: ['Study Rooms', 'Pomodoro'],
    },
  ];

  const collegeHubs = [
    { name: 'IIT Bombay Hub', activeCount: 'Peer Notes & Doubts', icon: '🏛️' },
    { name: 'DTU Delhi Hub', activeCount: 'Semester Exam Packs', icon: '🎓' },
    { name: 'BITS Pilani Hub', activeCount: 'Study Groups & Solved PYQs', icon: '🔬' },
    { name: 'COEP Pune Hub', activeCount: 'Engineering Formula Sheets', icon: '📐' },
    { name: 'VJTI Mumbai Hub', activeCount: 'Concept Video Explainers', icon: '⚙️' },
    { name: 'NIT Trichy Hub', activeCount: 'CS & ECE Handnotes', icon: '💻' },
  ];

  return (
    <section id="community-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          The Peer Ecosystem
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Learning Is{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Better Together
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Students discuss doubts in real-time, share handwritten notes, organize live Pomodoro study rooms, and help each other ace exams.
        </p>
      </div>

      {/* COMMUNITY CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
        {/* Left Column: Live Student Discussions Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Live Student Discussions & Notes Updates
            </h3>
            <span className="text-xs text-cyan-400 font-semibold">Updated 2m ago</span>
          </div>

          <div className="space-y-4">
            {communityDiscussions.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1324] to-[#080b15] border border-slate-800/90 hover:border-cyan-500/40 transition-all shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserInitialsBadge name={item.studentName} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.studentName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.college}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{item.time}</span>
                </div>


                <div>
                  <h4 className="text-sm font-bold text-white">{item.topic}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{item.comment}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {item.replies}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active College Hubs & Study Room Sprints */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Campus Hubs */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-black font-['Outfit'] text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Active College Peer Hubs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find classmates from your campus sharing semester-specific question banks and syllabus roadmaps.
            </p>

            <div className="space-y-2.5">
              {collegeHubs.map((hub) => (
                <div
                  key={hub.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{hub.icon}</span>
                    <span className="text-xs font-bold text-slate-200">{hub.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-800/40">
                    {hub.activeCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 shadow-xl space-y-3">
            <h4 className="text-base font-black font-['Outfit'] text-white">Join Live Study Rooms</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Study alongside 1,400+ peers in synchronized Pomodoro focus rooms with ambient focus audio.
            </p>
            <button
              onClick={onOpenStudyRooms}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
            >
              <span>Enter Active Study Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
