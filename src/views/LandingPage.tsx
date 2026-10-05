import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ProblemSection } from '../components/ProblemSection';
import { SolutionSection } from '../components/SolutionSection';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { StudyMaterialsShowcase } from '../components/StudyMaterialsShowcase';
import { LiveLearningShowcase } from '../components/LiveLearningShowcase';
import { LearningExperienceSection } from '../components/LearningExperienceSection';
import { Community } from '../components/Community';
import { AILearningAssistantSection } from '../components/AILearningAssistantSection';
import { LearnAndEarn } from '../components/LearnAndEarn';
import { VidyaTokensPreview } from '../components/VidyaTokensPreview';
import { CTA } from '../components/CTA';
import { PeerNotesModal } from '../components/PeerNotesModal';
import { Course, StudyRoom, DoubtItem } from '../data/platformData';
import { ContentItem } from '../types/content';

export interface LandingPageProps {
  courses?: Course[];
  studyRooms?: StudyRoom[];
  doubts?: DoubtItem[];
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth: (mode?: 'student_login' | 'admin_login' | 'register' | 'login') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const [isPeerNotesModalOpen, setIsPeerNotesModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  const handleExploreNotes = (subjectQuery?: string) => {
    if (subjectQuery) {
      setInitialSearchQuery(subjectQuery);
    } else {
      setInitialSearchQuery('');
    }
    setIsPeerNotesModalOpen(true);
  };

  const handleGetStarted = () => {
    onOpenAuth('register');
  };

  const handleOpenMaterial = (item: ContentItem) => {
    onNavigate('explore', { selectedResource: item });
  };

  return (
    <div id="yuvasetu-landing-page-root" className="w-full space-y-4 pb-16">
      {/* 1. HERO SECTION (Ecosystem Connected Visualization) */}
      <Hero
        onExploreNotes={handleExploreNotes}
        onGetStarted={handleGetStarted}
      />

      {/* 2. STUDENT PROBLEM SECTION (Missed a Lecture? Didn't Understand the Topic?) */}
      <ProblemSection
        onExploreSolution={() => handleExploreNotes()}
      />

      {/* 3. YUVASETU SOLUTION SECTION (One Platform. A Community of Learners.) */}
      <SolutionSection
        onExploreNotes={() => handleExploreNotes()}
        onGetStarted={handleGetStarted}
      />

      {/* 4. HOW IT WORKS (Connected 6-Step Visual Journey) */}
      <HowItWorks
        onJoinClick={handleGetStarted}
      />

      {/* 5. STUDY MATERIALS SECTION (Featured Item + Supporting Real Content Previews) */}
      <StudyMaterialsShowcase
        onExploreAll={() => handleExploreNotes()}
        onOpenMaterial={handleOpenMaterial}
      />

      {/* 6. LIVE LEARNING SECTION (Real Synchronous Sessions & Direct Link Join) */}
      <LiveLearningShowcase
        onViewAllSessions={() => onNavigate('live_sessions')}
        onOpenStudyRooms={() => onNavigate('study_rooms')}
      />

      {/* 7. CORE FEATURES SECTION (Everything You Need In One Place) */}
      <Features
        onFeatureClick={(targetView) => {
          if (targetView === 'explore') {
            handleExploreNotes();
          } else {
            onNavigate(targetView);
          }
        }}
      />

      {/* 8. LEARNING EXPERIENCE (Interactive Handnotes Reader, Video Player, AI Breakdown, Doubts) */}
      <LearningExperienceSection
        onExplore={() => handleExploreNotes()}
        onTryAI={() => onNavigate('ai_assistant')}
        onTryDoubts={() => onNavigate('doubts')}
      />

      {/* 9. COMMUNITY SECTION (Learning Is Better Together) */}
      <Community
        onJoinCommunity={handleGetStarted}
        onOpenStudyRooms={() => onNavigate('study_rooms')}
        onOpenDoubts={() => onNavigate('doubts')}
      />

      {/* 10. AI LEARNING ASSISTANT (First-Principles Samajh Se Safalta Tak AI Companion) */}
      <AILearningAssistantSection
        onOpenAI={() => onNavigate('ai_assistant')}
      />

      {/* 11. CONTRIBUTOR RECOGNITION & REWARDS (Turn Knowledge into Peer Impact) */}
      <LearnAndEarn
        onLearnMore={() => onNavigate('wallet')}
      />

      {/* 12. VIDYATOKENS SECTION (Micro-Economy For High-Value Peer Exchange) */}
      <VidyaTokensPreview
        onExploreWallet={() => onNavigate('wallet')}
      />

      {/* 13. FINAL CALL TO ACTION ("Your Next Breakthrough Starts with Understanding") */}
      <CTA
        onExploreClick={() => handleExploreNotes()}
        onGetStartedClick={handleGetStarted}
      />

      {/* INTERACTIVE PEER NOTES & VIDEO EXPLORER MODAL */}
      <PeerNotesModal
        isOpen={isPeerNotesModalOpen}
        onClose={() => setIsPeerNotesModalOpen(false)}
        initialQuery={initialSearchQuery}
        onSelectResource={(res) => {
          setIsPeerNotesModalOpen(false);
          onNavigate('explore', { selectedResource: res });
        }}
      />
    </div>
  );
};
