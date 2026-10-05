import React, { useState } from 'react';
import { ContentItem } from '../../types/content';
import { authService } from '../../services/authService';
import { activityService } from '../../services/activityService';
import { downloadContentItem, synthesizePagesForContent } from '../../utils/downloadHelper';
import {
  FileText,
  FileCode,
  Video,
  Play,
  Pause,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  Info,
  CheckCircle2,
  BookOpen,
  List,
  Sparkles,
  Award,
  Layers,
  Code2,
  Lightbulb,
  Check,
  FileDown,
} from 'lucide-react';

export interface ContentViewerProps {
  content: ContentItem;
  className?: string;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({ content, className = '' }) => {
  // States for PDF viewer
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showPageDrawer, setShowPageDrawer] = useState(false);
  const [pageInputVal, setPageInputVal] = useState('1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'notebook' | 'embedded'>('notebook');

  // States for Video player
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const currentUser = authService.getCurrentUser();

  const handleDownload = (format: 'pdf' | 'docx' = 'pdf') => {
    downloadContentItem(content, format);

    if (currentUser) {
      activityService.logPdfDownloaded(
        currentUser.id,
        currentUser.name,
        currentUser.email,
        content.id,
        content.title,
        content.pdf_data?.fileName || `${content.title.replace(/\s+/g, '_')}.${format}`,
        content.pdf_data?.fileSize || '10.5 MB',
        content.subject_name
      );
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePlayVideo = () => {
    const nextState = !isVideoPlaying;
    setIsVideoPlaying(nextState);
    if (nextState && currentUser) {
      activityService.logVideoStarted(
        currentUser.id,
        currentUser.name,
        currentUser.email,
        content.id,
        content.title,
        content.subject_name,
        content.video_data?.duration || '25 mins'
      );
    }
  };

  // 1. NOTES VIEWER
  if (content.content_type === 'note') {
    return (
      <div
        id="notes-content-viewer"
        className={`rounded-3xl bg-[#090d1a] border border-slate-800 p-6 sm:p-8 space-y-6 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <FileText className="w-4 h-4" />
            <span>Digital Study Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('pdf')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:text-white hover:border-cyan-500 transition-all cursor-pointer"
              title="Download Notes as PDF"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => handleDownload('docx')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:text-white hover:border-blue-500 transition-all cursor-pointer"
              title="Download Notes as Word Document"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Word (.docx)</span>
            </button>
          </div>
        </div>

        {/* Content Body with nice typography formatting */}
        <div className="prose prose-invert max-w-none space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
          {content.content_body ? (
            <div className="space-y-4 whitespace-pre-wrap font-sans">
              {content.content_body.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1
                      key={idx}
                      className="text-xl sm:text-2xl font-black font-['Outfit'] text-white pt-2 border-b border-slate-800 pb-2"
                    >
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-lg sm:text-xl font-bold font-['Outfit'] text-cyan-300 pt-3"
                    >
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-amber-300 pt-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const cleanedCode = paragraph.replace(/```[a-z]*/g, '').trim();
                  return (
                    <pre
                      key={idx}
                      className="p-4 rounded-2xl bg-[#04060d] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto my-3"
                    >
                      <code>{cleanedCode}</code>
                    </pre>
                  );
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote
                      key={idx}
                      className="p-4 rounded-2xl bg-cyan-950/30 border-l-4 border-cyan-400 text-cyan-200 text-xs sm:text-sm my-2"
                    >
                      {paragraph.replace('> ', '')}
                    </blockquote>
                  );
                }
                return (
                  <p key={idx} className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 italic">No notes body provided.</p>
          )}
        </div>
      </div>
    );
  }

  // 2. PDF / DOCUMENT VIEWER (High-Fidelity Multi-Page Handwritten & Structural Notes)
  if (content.content_type === 'pdf') {
    const rawPages = content.pdf_data?.pages;
    const pagesData =
      rawPages && rawPages.length > 0 ? rawPages : synthesizePagesForContent(content);
    const totalPages = Math.max(pagesData.length, content.pdf_data?.pageCount || 1);
    const activePage = pagesData[currentPdfPage - 1] || pagesData[0];
    const hasFileDataUrl = !!content.pdf_data?.fileDataUrl;
    const isDocx =
      content.pdf_data?.fileName?.toLowerCase().endsWith('.docx') ||
      content.pdf_data?.fileType === 'docx';

    const handleJumpToPage = (e: React.FormEvent) => {
      e.preventDefault();
      const p = parseInt(pageInputVal, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        setCurrentPdfPage(p);
      }
    };

    return (
      <div
        id="pdf-content-viewer"
        className={`rounded-3xl bg-[#070a14] border border-slate-800 overflow-hidden shadow-2xl space-y-0 ${className}`}
      >
        {/* PDF Top Control Toolbar */}
        <div className="p-3 sm:p-4 bg-[#0c1020] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 truncate max-w-[180px] sm:max-w-xs">
              {content.pdf_data?.fileName || `${content.title}.pdf`}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 font-mono border border-slate-800">
              {content.pdf_data?.fileSize || '3.2 MB'}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-[10px] text-emerald-300 font-bold border border-emerald-800/40 hidden sm:inline">
              Verified Academic
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View mode toggle if uploaded file exists */}
            {hasFileDataUrl && !isDocx && (
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('notebook')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === 'notebook'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reader
                </button>
                <button
                  onClick={() => setViewMode('embedded')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === 'embedded'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Original File
                </button>
              </div>
            )}

            {/* Outline Drawer Toggle */}
            <button
              onClick={() => setShowPageDrawer(!showPageDrawer)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showPageDrawer
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Page Index"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Outline</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] font-mono text-slate-300">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Navigation & Jump Form */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  const np = Math.max(1, currentPdfPage - 1);
                  setCurrentPdfPage(np);
                  setPageInputVal(String(np));
                }}
                disabled={currentPdfPage <= 1}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
                <input
                  type="text"
                  value={pageInputVal}
                  onChange={(e) => setPageInputVal(e.target.value)}
                  onBlur={() => {
                    const p = parseInt(pageInputVal, 10);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      setCurrentPdfPage(p);
                    } else {
                      setPageInputVal(String(currentPdfPage));
                    }
                  }}
                  className="w-8 text-center bg-slate-950 border border-slate-700 rounded py-0.5 text-[11px] font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-bold text-slate-400">/ {totalPages}</span>
              </form>

              <button
                onClick={() => {
                  const np = Math.min(totalPages, currentPdfPage + 1);
                  setCurrentPdfPage(np);
                  setPageInputVal(String(np));
                }}
                disabled={currentPdfPage >= totalPages}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Buttons: PDF and Word */}
            <div className="flex items-center gap-1.5">
              <button
                id="download-pdf-btn"
                onClick={() => handleDownload('pdf')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer ${
                  downloadSuccess
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:opacity-90'
                }`}
                title="Download directly to your PC or Mobile device as PDF"
              >
                {downloadSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
              </button>

              <button
                id="download-docx-btn"
                onClick={() => handleDownload('docx')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                title="Download document as Microsoft Word (.docx)"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-400" />
                <span>Word (.docx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Workspace */}
        {viewMode === 'embedded' && hasFileDataUrl ? (
          /* Real Embedded PDF/Document View */
          <div className="p-4 bg-[#03060f] flex flex-col items-center justify-center">
            <iframe
              src={content.pdf_data?.fileDataUrl}
              className="w-full h-[680px] rounded-2xl border border-slate-800 bg-white"
              title={content.title}
            />
          </div>
        ) : (
          /* Multi-Page Academic Notebook Reader */
          <div className="relative flex flex-col md:flex-row min-h-[520px]">
            {/* Outline Sidebar */}
            {showPageDrawer && (
              <div className="w-full md:w-64 bg-[#090e1c] border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1.5 max-h-[500px] overflow-y-auto shrink-0 animate-fadeIn">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>Page Outline ({totalPages})</span>
                  <span className="text-cyan-400 font-mono">Jump</span>
                </div>
                {pagesData.map((p, idx) => {
                  const pageNum = p.pageNumber || idx + 1;
                  const isSelected = pageNum === currentPdfPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPdfPage(pageNum);
                        setPageInputVal(String(pageNum));
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">
                        P.{pageNum}
                      </span>
                      <span className="truncate text-[11px] leading-tight">
                        {p.heading || p.title || `Section ${pageNum}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Simulated Sheet Canvas */}
            <div className="flex-1 p-4 sm:p-8 bg-[#04060e] flex flex-col items-center justify-start overflow-auto">
              <div
                className="w-full max-w-3xl bg-[#0d1326] border border-slate-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl transition-transform space-y-6 relative overflow-hidden"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Background Middle Align Center Watermark with Official Logo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-15">
                  <div className="relative flex flex-col items-center justify-center text-center p-6">
                    <img
                      src="/yuvasetu-watermark-logo.png"
                      alt="YuvaSetu Official Logo Watermark"
                      className="w-56 h-56 sm:w-72 sm:h-72 object-contain filter drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] font-mono text-cyan-400/80 font-bold tracking-widest uppercase mt-2">
                      ★ Official Verified Academic Resource ★
                    </span>
                  </div>
                </div>

                {/* Header watermark */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">YuvaSetu Academic Notes</span>
                    <span>•</span>
                    <span>{content.subject_name}</span>
                  </div>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-bold">
                    Page {currentPdfPage} of {totalPages}
                  </span>
                </div>

                {/* Dynamic Page Content */}
                {activePage && (
                  <div className="relative z-10 space-y-6">
                    {/* Topic badge & Title */}
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{activePage.topicBadge || content.subject_name}</span>
                      </span>

                      <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-tight">
                        {activePage.heading || activePage.title || `Section ${currentPdfPage}`}
                      </h2>
                    </div>

                    {/* Full Content Body / Explanations (Solves only-title issue) */}
                    {activePage.content && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#060914] border border-slate-800/80 space-y-2">
                        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Core Explanations & Notes</span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                          {activePage.content}
                        </div>
                      </div>
                    )}

                    {/* Key Notes Points / Takeaways */}
                    {(activePage.keyPoints || activePage.contentNotes) &&
                      (activePage.keyPoints || activePage.contentNotes)!.length > 0 && (
                        <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/40 space-y-2.5">
                          <div className="text-[10px] font-mono text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Key Takeaways & Exam Concepts</span>
                          </div>
                          <div className="space-y-2">
                            {(activePage.keyPoints || activePage.contentNotes)!.map((point, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-teal-100/90 leading-relaxed"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* ASCII Schematic / Diagram */}
                    {(activePage.diagramText || activePage.diagramAscii) && (
                      <div className="p-4 rounded-2xl bg-[#020409] border border-cyan-900/60 space-y-2">
                        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Visual Diagram & Conceptual Trace</span>
                        </div>
                        <pre className="text-[11px] sm:text-xs font-mono text-emerald-300 overflow-x-auto leading-tight p-3 bg-black/40 rounded-xl">
                          {activePage.diagramText || activePage.diagramAscii}
                        </pre>
                      </div>
                    )}

                    {/* Code Implementation */}
                    {activePage.codeSnippet && (
                      <div className="p-4 rounded-2xl bg-[#020409] border border-purple-900/60 space-y-2">
                        <div className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Optimal Code Implementation</span>
                        </div>
                        <pre className="text-[11px] sm:text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed p-3 bg-black/60 rounded-xl border border-purple-950">
                          <code>{activePage.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Key Formulas / Complexity Matrix */}
                    {activePage.keyFormulas && activePage.keyFormulas.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Complexity Equations & Exam Theorems</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-amber-200">
                          {activePage.keyFormulas.map((f, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-xl bg-black/30 border border-amber-900/40"
                            >
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exam Tips Callout */}
                    {activePage.examTips && (
                      <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block mb-0.5">Exam & Interview Tip:</strong>
                          <span>{activePage.examTips}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Footer */}
                <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">
                    Curated by {content.creator.name} ({content.creator.college || 'YuvaSetu'})
                  </span>
                  <span className="text-cyan-400 font-bold">YuvaSetu — Samajh Se Safalta Tak</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. VIDEO VIEWER
  if (content.content_type === 'video') {
    const chapters = content.video_data?.chapters || [
      { title: '00:00 - Introduction & Concept Overview', time: '00:00', seconds: 0 },
      { title: '06:30 - Deep-Dive Problem Walkthrough', time: '06:30', seconds: 390 },
      { title: '14:15 - Key Pitfalls to Avoid in Exams', time: '14:15', seconds: 855 },
    ];

    return (
      <div
        id="video-content-viewer"
        className={`rounded-3xl bg-[#090d1a] border border-slate-800 overflow-hidden shadow-2xl space-y-0 ${className}`}
      >
        {/* Video Player Screen */}
        <div className="relative aspect-video w-full bg-[#04060d] flex flex-col justify-between p-4 group">
          {content.video_data?.videoUrl?.includes('youtube') ? (
            <iframe
              src={content.video_data.videoUrl}
              title={content.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Top video bar */}
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {content.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  {content.video_data?.resolution || '1080p 60fps'}
                </span>
              </div>

              {/* Center Play Button & Animation */}
              <div className="flex flex-col items-center justify-center space-y-3 my-auto z-10 text-center">
                <button
                  id="video-play-toggle-btn"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  {isVideoPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
                <div className="bg-black/60 px-3 py-1 rounded-full text-xs text-slate-300 backdrop-blur-md">
                  {chapters[activeChapterIndex]?.title || 'Play Lecture'}
                </div>
              </div>

              {/* Bottom Video Controls */}
              <div className="z-10 bg-slate-950/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 space-y-2">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[35%] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="text-white hover:text-cyan-400"
                    >
                      {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-400">
                      04:12 / {content.video_data?.duration || '24 mins'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Volume2 className="w-4 h-4 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-4 h-4 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chapters & Timestamps Bar */}
        <div className="p-4 sm:p-6 bg-[#0c1020] border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lecture Chapters ({chapters.length})</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapterIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  activeChapterIndex === idx
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="truncate mr-2">{ch.title}</span>
                <span className="font-mono text-[10px] text-slate-500">{ch.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
