import React from "react";
import { BookOpen, Award, Flame, BookMarked, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { LessonUnit, UserStats, VocabularyWord } from "../types";
import { motion } from "motion/react";

interface DashboardProps {
  lessons: LessonUnit[];
  stats: UserStats;
  onSelectLesson: (id: string) => void;
  onNavigateToTab: (tab: "lessons" | "sandbox" | "chat") => void;
  onResetProgress: () => void;
}

export default function Dashboard({
  lessons,
  stats,
  onSelectLesson,
  onNavigateToTab,
  onResetProgress
}: DashboardProps) {
  // Re-fetch vocabulary details for bookmarked words
  const bookmarkedDetails = React.useMemo(() => {
    const list: VocabularyWord[] = [];
    lessons.forEach((l) => {
      l.words.forEach((w) => {
        if (stats.bookmarkedWords.includes(w.polish)) {
          // Avoid duplicates
          if (!list.some((item) => item.polish === w.polish)) {
            list.push(w);
          }
        }
      });
    });
    return list;
  }, [lessons, stats.bookmarkedWords]);

  const progressPercentage = Math.round(
    (stats.completedLessons.length / lessons.length) * 100
  );

  return (
    <div className="space-y-8" id="dashboard-root">
      {/* Hero Welcome */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="dashboard-hero">
        <div>
          <span className="text-xs font-mono tracking-wider text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">
            WITAMY W POLSCE!
          </span>
          <h1 className="text-3xl font-sans font-medium tracking-tight text-slate-900 mt-2">
            Cześć! Ready for Polish today?
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Master the notorious noun cases, gender agreements, and essential conversational grammar of Polish with bite-sized, interactive drills.
          </p>
        </div>
        
        {/* Quick Progress Wheel */}
        <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-xl shadow-sm self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <div className="text-xl font-mono font-medium text-slate-800">{progressPercentage}%</div>
            <div className="text-xs text-slate-400">Course Mastery</div>
          </div>
          <div className="relative w-12 h-12">
            {/* Draw SVG Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-indigo-600 transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Streak */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-amber-50 rounded-xl group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">STREAK</p>
            <p className="text-xl font-sans font-semibold text-slate-800">{stats.streak} Days</p>
          </div>
        </div>

        {/* XP & Level Progress */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">LEVEL & EXPERIENCE</p>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl font-sans font-bold text-slate-800">
                  Lvl {Math.floor(stats.xp / 100) + 1}
                </span>
                <span className="text-xs text-slate-400">
                  ({stats.xp} XP total)
                </span>
              </div>
            </div>
          </div>
          
          {/* Level progress bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
              <span>Next Level</span>
              <span>{stats.xp % 100}/100 XP</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
                style={{ width: `${stats.xp % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vocabulary Count */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-teal-50 rounded-xl group-hover:scale-105 transition-transform">
            <BookMarked className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">PINNED WORDS</p>
            <p className="text-xl font-sans font-semibold text-slate-800">{stats.bookmarkedWords.length} in Chest</p>
          </div>
        </div>

        {/* Lessons Cleared */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">LESSONS PASSED</p>
            <p className="text-xl font-sans font-semibold text-slate-800">
              {stats.completedLessons.length} / {lessons.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Syllabus / Lessons Path */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-semibold text-slate-800">Structured Study Chapters</h2>
            <button
               onClick={() => onNavigateToTab("lessons")}
               className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              Exams console <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const isCompleted = stats.completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  id={`lesson-card-${lesson.id}`}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex items-start gap-4 transition-all hover:shadow-xs group cursor-pointer"
                  onClick={() => onSelectLesson(lesson.id)}
                >
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 group-hover:border-indigo-500 group-hover:text-indigo-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {lesson.category}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {lesson.title} <span className="text-sm text-slate-400 font-normal">({lesson.englishTitle})</span>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {lesson.grammarConcept}
                    </p>
                  </div>

                  <button 
                    className="self-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLesson(lesson.id);
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Word Book Chest & AI Playgrounds */}
        <div className="space-y-6">
          {/* Quick-AI-Pillboxes */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-mono bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded">
                AI Powered Core-Features
              </span>
              <h3 className="font-sans font-medium text-base text-slate-100">Unlock Fluent Grammar Conversing</h3>
              <p className="text-xs text-slate-300">
                Type sentences in Polish to see instant grammar cases maps, or speak with Marek at the cafe.
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onNavigateToTab("sandbox")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white text-indigo-950 text-xs font-semibold hover:bg-indigo-50 transition-colors cursor-pointer text-center"
                >
                  Grammar Sandbox
                </button>
                <button
                  onClick={() => onNavigateToTab("chat")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 text-white border border-indigo-500/50 text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer text-center"
                >
                  Chat with Marek
                </button>
              </div>
            </div>
            {/* Ambient decorative gradient elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          </div>

          {/* Bookmarked Words Chest */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-teal-600" />
                <h3 className="font-sans font-medium text-slate-800 text-sm">My Word Study Chest</h3>
              </div>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full font-mono">
                {bookmarkedDetails.length} items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {bookmarkedDetails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <BookMarked className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-xs text-slate-400">Your Study Chest is empty.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click the bookmark pin icon in any vocabulary course list to pin difficult keywords here!</p>
                </div>
              ) : (
                bookmarkedDetails.map((word, i) => (
                  <div key={word.polish} className={`pt-2 ${i === 0 ? 'pt-0' : ''}`}>
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-sans font-medium text-slate-800 text-sm select-all">
                        {word.polish}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {word.pronunciation}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {word.english}
                    </p>
                    <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                      {word.examplePolish} — {word.exampleEnglish}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone Reset Option */}
      <div className="pt-6 border-t border-slate-150 flex justify-between items-center text-xs text-slate-400">
        <span>Polish Vocabulary & Grammar Tutor — 2026 Sandbox Environment</span>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your progress metadata, streak checkpoints, and pin chests?")) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors py-1 px-2 rounded-md hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Personal Data
        </button>
      </div>
    </div>
  );
}
