import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  BookOpen,
  Sparkles,
  MessageSquare,
  Bookmark,
  ChevronLeft,
  Check,
  X,
  Volume2,
  Send,
  Loader2,
  RefreshCw,
  Trophy,
  ArrowRight,
  BookmarkCheck,
  Zap,
  BookMarked,
  Layers,
  Heart,
  Flame,
  Globe2,
  HelpCircle
} from "lucide-react";
import { POLISH_LESSONS } from "./data";
import { LessonUnit, UserStats, VocabularyWord, Exercise, ChatTurn, AIGrammarReview } from "./types";
import Dashboard from "./components/Dashboard";

// Base stats
const INITIAL_STATS: UserStats = {
  xp: 120,
  streak: 3,
  lastActive: new Date().toISOString(),
  completedLessons: ["basics"],
  bookmarkedWords: ["Cześć", "Dziękuję"],
  knownWordsCount: 8
};

export default function App() {
  // Navigation & Tab setup
  const [currentTab, setCurrentTab] = useState<"dashboard" | "lessons" | "sandbox" | "chat">("dashboard");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // App Stats with local storage persistence
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem("polish_tutor_stats");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Local storage read error", e);
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("polish_tutor_stats", JSON.stringify(stats));
    } catch (e) {
      console.error("Local storage save error", e);
    }
  }, [stats]);

  // Active Lesson steps
  const [lessonStep, setLessonStep] = useState<"vocabulary" | "exercises" | "summary" | "pronunciation">("vocabulary");
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [checkedAnswer, setCheckedAnswer] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [lessonCorrectAnswersCount, setLessonCorrectAnswersCount] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Pronunciation Practice states
  const [selectedWordToPronounce, setSelectedWordToPronounce] = useState<VocabularyWord | null>(null);
  const [isRecordingSpeech, setIsRecordingSpeech] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const [speechFeedbackText, setSpeechFeedbackText] = useState<string>("");
  const [unsupportedSpeechRecognition, setUnsupportedSpeechRecognition] = useState<boolean>(false);
  const [simulationTextInput, setSimulationTextInput] = useState<string>("");

  // Simple clean similarity compare metrics
  const evaluateSpeech = (spoken: string, target: string) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\s]/g, "").trim();
    const cleanTarget = target.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\s]/g, "").trim();
    
    if (cleanSpoken === cleanTarget) {
      return { score: 100, feedback: "Doskonale! Perfect pronunciation!" };
    }
    
    if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      return { score: 90, feedback: "Świetnie! Very close and highly intelligible." };
    }
    
    // Count simple common matching letters
    let matches = 0;
    const minLen = Math.min(cleanSpoken.length, cleanTarget.length);
    for (let i = 0; i < minLen; i++) {
      if (cleanSpoken[i] === cleanTarget[i]) matches++;
    }
    const ratio = Math.round((matches / Math.max(cleanSpoken.length, cleanTarget.length)) * 100);
    
    if (ratio > 70) {
      return { score: ratio, feedback: "Bardzo dobrze! Solid effort, minor acoustic alignment needed." };
    } else if (ratio > 40) {
      return { score: ratio, feedback: "Dobra próba! A bit more clear enunciation is recommended." };
    } else {
      return { score: ratio || 20, feedback: "Próbuj dalej! Try listening to the pronunciation and matching the syllable cadence." };
    }
  };

  // Web Speech API handler
  const [recognitionObj, setRecognitionObj] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.lang = "pl-PL";
        rec.interimResults = false;

        rec.onstart = () => {
          setIsRecordingSpeech(true);
          setSpeechTranscript("");
          setSpeechScore(null);
          setSpeechFeedbackText("");
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setSpeechTranscript(resultText);
          if (selectedWordToPronounce) {
            const { score, feedback } = evaluateSpeech(resultText, selectedWordToPronounce.polish);
            setSpeechScore(score);
            setSpeechFeedbackText(feedback);
            if (score >= 50) {
              setStats(prev => ({ ...prev, xp: prev.xp + 15 }));
            }
          }
        };

        rec.onerror = (err: any) => {
          console.error("Speech Recognition Error", err);
          setIsRecordingSpeech(false);
          setUnsupportedSpeechRecognition(true);
        };

        rec.onend = () => {
          setIsRecordingSpeech(false);
        };

        setRecognitionObj(rec);
      } else {
        setUnsupportedSpeechRecognition(true);
      }
    }
  }, [selectedWordToPronounce]);

  // Handle local simulation testing
  const handleSimulateSpeechCheck = (textInputVal: string) => {
    if (!selectedWordToPronounce) return;
    const cleanInput = textInputVal.trim();
    if (!cleanInput) return;

    setSpeechTranscript(cleanInput);
    const { score, feedback } = evaluateSpeech(cleanInput, selectedWordToPronounce.polish);
    setSpeechScore(score);
    setSpeechFeedbackText(feedback);
    if (score >= 50) {
      setStats(prev => ({ ...prev, xp: prev.xp + 15 }));
    }
  };

  // AI Grammar Sandbox states
  const [sandboxSentence, setSandboxSentence] = useState<string>("");
  const [checkingGrammar, setCheckingGrammar] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<AIGrammarReview | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [activeGrammarTopic, setActiveGrammarTopic] = useState<string>("The Instrumental Case (Narzędnik)");
  const [customExplanation, setCustomExplanation] = useState<string>("");
  const [fetchingTopicExplanation, setFetchingTopicExplanation] = useState<boolean>(false);

  // AI Chat with Marek states
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>(() => {
    try {
      const stored = localStorage.getItem("polish_tutor_chat");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        sender: "marek",
        polish: "Cześć! Jestem Marek. Jak się masz? Chcesz porozmawiać o jedzeniu, pracy czy podróżach?",
        english: "Hello! I am Marek. How are you doing? Do you want to talk about food, work, or travels?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("polish_tutor_chat", JSON.stringify(chatHistory));
    } catch (e) {}
  }, [chatHistory]);

  const [chatInput, setChatInput] = useState<string>("");
  const [sendingChat, setSendingChat] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // AI Custom exercises state for active lesson
  const [aiExercises, setAiExercises] = useState<Exercise[] | null>(null);
  const [generatingAiExercises, setGeneratingAiExercises] = useState<boolean>(false);
  const [exerciseMode, setExerciseMode] = useState<"standard" | "ai-generated">("standard");

  // Health and API token check
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiOnline(data.hasApiKey);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const activeLessonObject = useMemo(() => {
    return POLISH_LESSONS.find((l) => l.id === selectedLessonId) || null;
  }, [selectedLessonId]);

  // Synchronize vocabulary selection when lesson changes
  useEffect(() => {
    if (selectedLessonId && activeLessonObject) {
      setLessonStep("vocabulary");
      setSpeechTranscript("");
      setSpeechScore(null);
      setSpeechFeedbackText("");
      setSimulationTextInput("");
      if (activeLessonObject.words.length > 0) {
        setSelectedWordToPronounce(activeLessonObject.words[0]);
      }
    }
  }, [selectedLessonId, activeLessonObject]);

  // Computed Exercises base
  const availableExercises = useMemo(() => {
    if (!activeLessonObject) return [];
    return exerciseMode === "ai-generated" && aiExercises ? aiExercises : activeLessonObject.exercises;
  }, [activeLessonObject, exerciseMode, aiExercises]);

  const currentExercise = useMemo<Exercise | null>(() => {
    if (!availableExercises || availableExercises.length === 0) return null;
    return availableExercises[currentExerciseIdx] || null;
  }, [availableExercises, currentExerciseIdx]);

  // Populate scrambled / options pool if exercise changes
  useEffect(() => {
    if (currentExercise) {
      setSelectedOption(null);
      setCheckedAnswer(false);
      setShowExplanation(false);
      if (currentExercise.type === "reorder") {
        // Scrambled pool
        setReorderedWords([]);
      }
    }
  }, [currentExerciseIndexUpdated()]);

  function currentExerciseIndexUpdated() {
    return `${selectedLessonId}-${exerciseMode}-${currentExerciseIdx}`;
  }

  // Audio Pronunciation Synthesis (client-side fallback using window.speechSynthesis if available, or visual chime)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const speakPolish = (text: string) => {
    setPlayingAudio(text);
    setTimeout(() => setPlayingAudio(null), 1000);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Look for Polish voice
      const voices = window.speechSynthesis.getVoices();
      const plVoice = voices.find(v => v.lang.startsWith('pl') || v.lang.includes('Poland'));
      if (plVoice) utterance.voice = plVoice;
      utterance.lang = 'pl-PL';
      utterance.rate = 0.85; // Learner friendly speed
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset progress handlers
  const handleResetProgress = () => {
    setStats(INITIAL_STATS);
    localStorage.removeItem("polish_tutor_stats");
    setChatHistory([
      {
        sender: "marek",
        polish: "Cześć! Jestem Marek. Jak się masz? Chcesz porozmawiać o jedzeniu, pracy czy podróżach?",
        english: "Hello! I am Marek. How are you doing? Do you want to talk about food, work, or travels?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Toggle bookmark / Pin word
  const toggleBookmark = (polish: string) => {
    setStats(prev => {
      const isStarred = prev.bookmarkedWords.includes(polish);
      const newStarred = isStarred 
        ? prev.bookmarkedWords.filter(w => w !== polish)
        : [...prev.bookmarkedWords, polish];
      return { ...prev, bookmarkedWords: newStarred };
    });
  };

  // Submit Answer validation for exercises
  const handleSubmitAnswer = () => {
    if (!currentExercise) return;
    
    let isCorrect = false;
    if (currentExercise.type === "reorder") {
      const userString = reorderedWords.join(" ").trim();
      const correctString = currentExercise.correctAnswer.trim();
      isCorrect = userString.toLowerCase() === correctString.toLowerCase();
    } else {
      isCorrect = selectedOption?.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
    }

    setIsAnswerCorrect(isCorrect);
    setCheckedAnswer(true);

    if (isCorrect) {
      setLessonCorrectAnswersCount(prev => prev + 1);
      // Give XP!
      setStats(prev => ({
        ...prev,
        xp: prev.xp + 15
      }));
    } else {
      // Small penalty or alternative motivation
      setStats(prev => ({
        ...prev,
        xp: prev.xp + 2 // still give minor XP for effort!
      }));
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIdx + 1 < availableExercises.length) {
      setCurrentExerciseIdx(prev => prev + 1);
    } else {
      // Finished all lesson drills!
      setLessonStep("summary");
      if (activeLessonObject && !stats.completedLessons.includes(activeLessonObject.id)) {
        setStats(prev => ({
          ...prev,
          completedLessons: [...prev.completedLessons, activeLessonObject.id],
          xp: prev.xp + 50 // bonus for finalization
        }));
      }
    }
  };

  // Trigger dynamic exercise generator via Gemini
  const handleGenerateAiDrills = async () => {
    if (!activeLessonObject) return;
    setGeneratingAiExercises(true);
    try {
      const response = await fetch("/api/gemini/generate-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockTitle: activeLessonObject.title,
          topicDescription: activeLessonObject.grammarFocus
        })
      });
      if (!response.ok) {
        throw new Error("Failed to reach Gemini planner server.");
      }
      const data = await response.json();
      if (data && Array.isArray(data.exercises)) {
        setAiExercises(data.exercises);
        setExerciseMode("ai-generated");
        setCurrentExerciseIdx(0);
        setLessonCorrectAnswersCount(0);
        setLessonStep("exercises");
      }
    } catch (err: any) {
      alert("AI exercise generation error: " + err.message);
    } finally {
      setGeneratingAiExercises(false);
    }
  };

  // Run AI sandbox grammatical check
  const handleCheckGrammar = async () => {
    if (!sandboxSentence.trim()) return;
    setCheckingGrammar(true);
    setSandboxResult(null);
    setSandboxError(null);

    try {
      const response = await fetch("/api/gemini/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: sandboxSentence })
      });
      if (!response.ok) {
        throw new Error("Tutor node was unable to map analysis.");
      }
      const result = await response.json();
      setSandboxResult(result);
    } catch (e: any) {
      setSandboxError(e.message || "Failed to analyze grammar.");
    } finally {
      setCheckingGrammar(false);
    }
  };

  // Fetch specialized AI grammar topic explainer
  const handleFetchTopicExplanation = async (topic: string) => {
    setActiveGrammarTopic(topic);
    setFetchingTopicExplanation(true);
    setCustomExplanation("");

    try {
      const response = await fetch("/api/gemini/explain-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      if (!response.ok) {
        throw new Error("Grammar library is temporarily offline.");
      }
      const data = await response.json();
      setCustomExplanation(data.explanation || "No explanation provided.");
    } catch (e: any) {
      setCustomExplanation("### Error\nFailed to download markdown content: " + e.message);
    } finally {
      setFetchingTopicExplanation(false);
    }
  };

  // Send message to Marek
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || sendingChat) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatError(null);
    setSendingChat(true);

    // Append user message immediately
    const userTurn: ChatTurn = {
      sender: "user",
      polish: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userTurn]);

    try {
      const reqHistory = chatHistory.slice(-6).map((x) => ({
        role: x.sender === "user" ? "user" : "model",
        text: x.polish
      }));

      const response = await fetch("/api/gemini/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: reqHistory,
          message: userMsg
        })
      });

      if (!response.ok) {
        throw new Error("Marek is taking a coffee break. Please retry in a second!");
      }

      const data = await response.json();

      const marekTurn: ChatTurn = {
        sender: "marek",
        polish: data.polishResponse || "Nie rozumiem...",
        english: data.englishResponse,
        feedback: data.userFeedback,
        isCorrect: !data.userHasMistakes,
        alternative: data.suggestedAlternative,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, marekTurn]);
      
      // Award communication XP
      setStats(prev => ({
        ...prev,
        xp: prev.xp + 25,
        streak: Math.max(prev.streak, 4) // Bump streak for active engagement
      }));
    } catch (e: any) {
      setChatError(e.message || "Failed to chat.");
    } finally {
      setSendingChat(false);
    }
  };

  // Predefined sandbox templates
  const sandboxTemplates = [
    "Mam zielonego psa.",
    "Ona jest pięknym lekarka.",
    "Nie lubię ciepłą herbatę.",
    "Mówię z bardzo miłym przyjacielem."
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 flex font-sans text-slate-800" id="main-container">
      
      {/* LEFT MINIMAL NAV SIDEBAR - Geometric Balance Inspired */}
      <nav className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 justify-between shrink-0" id="left-sidebar">
        <div className="flex flex-col gap-10 items-center w-full">
          {/* Crimson "P" National Brand Accent */}
          <div 
            onClick={() => { setCurrentTab("dashboard"); setSelectedLessonId(null); }}
            className="w-11 h-11 bg-crimson-600 rounded-xl flex flex-col items-center justify-center text-white font-serif font-black text-2xl cursor-pointer hover:opacity-90 select-none shadow-sm transition-transform hover:scale-105" 
            style={{ backgroundColor: "#DC143C" }}
          >
            <span>P</span>
            <div className="w-full h-1 bg-white opacity-45 -mt-0.5 self-center max-w-[20px]" />
          </div>

          {/* Navigation Item Containers */}
          <div className="flex flex-col gap-5 w-full px-2" id="nav-items-pool">
            {/* Dashboard Icon */}
            <button
              onClick={() => { setCurrentTab("dashboard"); setSelectedLessonId(null); }}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                currentTab === "dashboard" && !selectedLessonId
                  ? "bg-slate-100 text-[#DC143C] font-semibold shadow-xs"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              title="Dashboard Home"
            >
              <Home className="w-[22px] h-[22px]" />
            </button>

            {/* Courses / Chapters Icon */}
            <button
              onClick={() => { setCurrentTab("lessons"); setSelectedLessonId(null); }}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                currentTab === "lessons" || selectedLessonId
                  ? "bg-slate-100 text-[#DC143C] font-semibold"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              title="Syllabus Chapters"
            >
              <BookOpen className="w-[22px] h-[22px]" />
            </button>

            {/* AI Grammar Sandbox */}
            <button
              onClick={() => { setCurrentTab("sandbox"); setSelectedLessonId(null); }}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                currentTab === "sandbox"
                  ? "bg-slate-100 text-[#DC143C] font-semibold"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              title="AI Grammar Sandbox"
            >
              <Sparkles className="w-[22px] h-[22px]" />
            </button>

            {/* AI Marek Practice Partner Coffee Chat */}
            <button
              onClick={() => { setCurrentTab("chat"); setSelectedLessonId(null); }}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                currentTab === "chat"
                  ? "bg-slate-100 text-[#DC143C] font-semibold"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              title="Marek Cafe Partner"
            >
              <MessageSquare className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>

        {/* User Account / Decorative National Polish Pin Badge */}
        <div className="flex flex-col items-center gap-4">
          {!apiOnline && (
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" title="API Key Required" />
          )}
          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-white uppercase font-mono">
            EN
          </div>
        </div>
      </nav>

      {/* RIGHT CHANNELS AND CONTENT PANELS */}
      <div className="flex-1 flex flex-col min-w-0" id="main-view-workspace">
        
        {/* HEADER BAR - Geometric Balance Standard */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0" id="main-header">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {selectedLessonId ? (
                <>
                  <button 
                    onClick={() => setSelectedLessonId(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg mr-1 text-slate-500 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span>{activeLessonObject?.title}</span>
                  <span className="text-slate-400 font-medium text-sm md:text-base hidden sm:inline">
                    ({activeLessonObject?.englishTitle})
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {currentTab === "dashboard" && "Study Dashboard"}
                    {currentTab === "lessons" && "Polish Syllabus Chapters"}
                    {currentTab === "sandbox" && "AI Grammar Sandbox"}
                    {currentTab === "chat" && "Marek's Language Cafe"}
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs text-[#DC143C] font-bold uppercase tracking-widest mt-0.5">
              {selectedLessonId ? activeLessonObject?.category : "POLISH GRAMMAR DECRYPTER"}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Daily Goal Gauge Cylinders - Geometric Balance Visual Unique */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DAILY CHALLENGE</span>
              <div className="flex gap-1 mt-1">
                <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: stats.xp >= 50 ? "#DC143C" : "#E2E8F0" }}></div>
                <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: stats.xp >= 100 ? "#DC143C" : "#E2E8F0" }}></div>
                <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: stats.xp >= 150 ? "#DC143C" : "#E2E8F0" }}></div>
                <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: stats.xp >= 200 ? "#DC143C" : "#E2E8F0" }}></div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-205 hidden sm:block"></div>

            {/* Level Badge and Total XP Container */}
            <div className="flex items-center gap-3">
              <div className="h-10 px-3 bg-red-50 border border-red-150 rounded-xl flex flex-col justify-center items-center shrink-0">
                <span className="text-[9px] font-bold text-[#DC143C] uppercase tracking-widest leading-none font-mono">LEVEL</span>
                <span className="text-sm font-black text-[#DC143C] leading-none mt-0.5">{Math.floor(stats.xp / 100) + 1}</span>
              </div>
              <div className="text-right">
                <div className="text-lg md:text-xl font-black text-slate-900 leading-none">{stats.xp}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mt-1">TOTAL POINTS</div>
              </div>
            </div>

          </div>
        </header>

        {/* CONTENT CHANNELS GRID (Left block for main view, right side for geometric widgets) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 grid grid-cols-12 gap-8" id="content-row">
          
          {/* COL COLUMN 8: MAIN LESSON OR VIEW WORKSPACE */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-6" id="primary-view-panel">
            
            {!apiOnline && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs flex gap-2.5 items-center">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong>Demo Mode Enabled</strong>: GEMINI_API_KEY secret is not present in Settings. Offline lessons and standard preconfigured exercises remain fully functional, but conversational AI Marek and dynamic sandbox parsing will be simulated or prompt configuration tips. Configure your API key to activate real generative checks.
                </div>
              </div>
            )}

            {/* 1. SEPARATE VIEW ROUTER */}
            {selectedLessonId && activeLessonObject ? (
              
              /* ============= LESSON DETAILS / COURSE DRILLS INTERFACE ============= */
              <div className="space-y-6" id="active-lesson-interface">
                
                {/* Upper navigation bar */}
                <div className="flex justify-between items-center bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                    <button 
                      onClick={() => setLessonStep("vocabulary")}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${lessonStep === "vocabulary" ? "bg-slate-100 text-[#DC143C]" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      1. Words Flashcards
                    </button>
                    <span className="text-slate-350">/</span>
                    <button 
                      onClick={() => {
                        setLessonStep("pronunciation");
                        setSpeechTranscript("");
                        setSpeechScore(null);
                        setSpeechFeedbackText("");
                        setSimulationTextInput("");
                        if (activeLessonObject.words.length > 0) {
                          setSelectedWordToPronounce(activeLessonObject.words[0]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${lessonStep === "pronunciation" ? "bg-slate-100 text-[#DC143C]" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      🗣️ Pronunciation
                    </button>
                    <span className="text-slate-350">/</span>
                    <button 
                      onClick={() => {
                        setExerciseMode("standard");
                        setCurrentExerciseIdx(0);
                        setLessonStep("exercises");
                      }}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${lessonStep === "exercises" && exerciseMode === "standard" ? "bg-slate-100 text-[#DC143C]" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      2. Exam Drills
                    </button>
                    <span className="text-slate-350 font-serif">/</span>
                    <button
                      onClick={handleGenerateAiDrills}
                      disabled={generatingAiExercises}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-all inline-flex items-center gap-1 cursor-pointer ${
                        lessonStep === "exercises" && exerciseMode === "ai-generated"
                          ? "bg-slate-100 text-[#DC143C]"
                          : "text-slate-500 hover:text-[#DC143C]"
                      }`}
                      title="Generates 3 fresh drills on this specific topic"
                    >
                      {generatingAiExercises ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Customizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#DC143C]" /> Generate AI Drills
                        </>
                      )}
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedLessonId(null)}
                    className="text-xs font-mono font-bold text-slate-400 hover:text-[#DC143C] inline-flex items-center gap-1"
                  >
                    All Units <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* A. VOCABULARY MEMORIZATION PANEL */}
                {lessonStep === "vocabulary" && (
                  <div className="space-y-6" id="vocabulary-memorization-suite">
                    
                    {/* Grammar summary card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden" id="concept-summary-card">
                      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: "#DC143C" }} />
                      <h3 className="font-serif italic text-lg text-slate-800 mb-2">The Concept Blueprint: {activeLessonObject.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-600 mb-4 whitespace-pre-line">
                        {activeLessonObject.grammarExplanation}
                      </p>
                      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 uppercase tracking-wider">PRIMARY TARGET TRICK</span>
                        <code className="text-xs text-slate-700 font-mono block select-all">
                          {activeLessonObject.grammarFocus}
                        </code>
                      </div>
                    </div>

                    {/* Word grids list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">
                        Topic Vocabulary Deck ({activeLessonObject.words.length} items)
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeLessonObject.words.map((word) => {
                          const isBookmarked = stats.bookmarkedWords.includes(word.polish);
                          return (
                            <div 
                              key={word.polish} 
                              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-xs"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <span className="text-xs font-mono text-slate-400 tracking-tight capitalize block">
                                    {word.category} {word.gender ? `• ${word.gender}` : ""}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <h4 className="text-xl font-sans font-semibold text-slate-900 tracking-tight select-all">
                                      {word.polish}
                                    </h4>
                                    <button 
                                      onClick={() => speakPolish(word.polish)}
                                      className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${playingAudio === word.polish ? 'text-[#DC143C]' : 'text-slate-400 hover:text-slate-600'}`}
                                      title="Click to hear human pronunciation"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <span className="text-xs text-slate-400 italic block font-mono mt-0.5">
                                    [{word.pronunciation}]
                                  </span>
                                </div>

                                <button 
                                  onClick={() => toggleBookmark(word.polish)}
                                  className="text-slate-300 hover:text-amber-500 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                  title="Pin word cards to bookmarked chest"
                                >
                                  {isBookmarked ? (
                                    <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
                                  ) : (
                                    <Bookmark className="w-5 h-5" />
                                  )}
                                </button>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                                <p className="text-sm font-medium text-slate-700">
                                  {word.english}
                                </p>
                                <div className="text-xs text-slate-500 italic mt-1 leading-normal">
                                  <span className="text-slate-400 font-sans">E.g.</span> "{word.examplePolish}"
                                  <span className="block text-[11px] text-slate-400">{word.exampleEnglish}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={() => {
                          setExerciseMode("standard");
                          setCurrentExerciseIdx(0);
                          setLessonStep("exercises");
                        }}
                        className="px-8 py-3 bg-slate-900 hover:bg-[#DC143C] text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        Enter Challenge Room <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* 🗣️ PRONUNCIATION PRACTICE PANEL */}
                {lessonStep === "pronunciation" && activeLessonObject && (
                  <div className="space-y-6" id="pronunciation-practice-suite">
                    
                    {/* Introductory card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#DC143C]" />
                      <div className="flex items-start gap-4">
                        <span className="p-3 bg-red-50 text-[#DC143C] rounded-xl text-xl shrink-0">🗣️</span>
                        <div>
                          <h3 className="font-sans font-bold text-base text-slate-800">Polish Pronunciation Lab</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Practice correct dental fricatives, nasal vowels, and soft consonants. Choose any bookmarked or lesson word from the deck, listen to the native cadence model, and record yourself.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left: Word Selection column */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 md:col-span-1 h-[480px] flex flex-col">
                        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">
                          Select Word
                        </h4>
                        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                          {activeLessonObject.words.map((word) => {
                            const isSelected = selectedWordToPronounce?.polish === word.polish;
                            return (
                              <button
                                key={word.polish}
                                onClick={() => {
                                  setSelectedWordToPronounce(word);
                                  setSpeechTranscript("");
                                  setSpeechScore(null);
                                  setSpeechFeedbackText("");
                                  setSimulationTextInput("");
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                  isSelected 
                                    ? "bg-red-50/20 border-[#DC143C] text-slate-900" 
                                    : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100/70"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-sans font-semibold text-xs leading-none truncate">{word.polish}</p>
                                  <p className="text-[10px] text-slate-400 mt-1 truncate">{word.english}</p>
                                </div>
                                <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#DC143C]" : "text-slate-400"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Active practice sandbox column */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:col-span-2 space-y-6 flex flex-col justify-between min-h-[480px]">
                        
                        {selectedWordToPronounce ? (
                          <div className="space-y-6 flex-1 flex flex-col justify-between">
                            
                            {/* Active focus block */}
                            <div className="text-center space-y-2 py-4">
                              <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                ACTIVE TARGET
                              </span>
                              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1 select-all">
                                {selectedWordToPronounce.polish}
                              </h2>
                              <p className="text-xs text-slate-500 font-mono tracking-tight font-medium">
                                Phonetic guide: <span className="text-[#DC143C] font-semibold">[{selectedWordToPronounce.pronunciation}]</span>
                              </p>
                              <p className="text-xs text-slate-400 italic">
                                English translation: "{selectedWordToPronounce.english}"
                              </p>
                            </div>

                            {/* Pronunciation Actions */}
                            <div className="bg-slate-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-around gap-6 border border-slate-100">
                              
                              {/* 1. Listen reference */}
                              <button
                                onClick={() => speakPolish(selectedWordToPronounce.polish)}
                                className="flex flex-col items-center gap-2 group p-4 bg-white border border-slate-200 hover:border-[#DC143C] rounded-2xl transition-all w-full sm:w-36 text-center cursor-pointer shadow-xs"
                              >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${playingAudio === selectedWordToPronounce.polish ? "bg-red-100 text-[#DC143C]" : "bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-[#DC143C]"}`}>
                                  <Volume2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-705 uppercase tracking-wider">Listen Audio</span>
                              </button>

                              {/* 2. Record speaking */}
                              <button
                                onClick={() => {
                                  if (isRecordingSpeech) {
                                    recognitionObj?.stop();
                                  } else {
                                    setSpeechTranscript("");
                                    setSpeechScore(null);
                                    setSpeechFeedbackText("");
                                    try {
                                      recognitionObj?.start();
                                    } catch (e) {
                                      console.error("Mic start failed", e);
                                    }
                                  }
                                }}
                                className={`flex flex-col items-center gap-2 group p-4 rounded-2xl transition-all w-full sm:w-36 text-center cursor-pointer shadow-xs border ${
                                  isRecordingSpeech 
                                    ? "bg-red-50 border-[#DC143C] text-red-705 animate-pulse" 
                                    : "bg-white border-slate-200 hover:border-[#DC143C] text-slate-700 hover:text-[#DC143C]"
                                }`}
                              >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isRecordingSpeech ? "bg-red-105 text-[#DC143C]" : "bg-slate-100 group-hover:bg-red-50"}`}>
                                  <span className="text-xl">🎙️</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">
                                  {isRecordingSpeech ? "Stop Mic" : "Record Mic"}
                                </span>
                              </button>
                            </div>

                            {/* Speech feedback module */}
                            <div className="space-y-3">
                              
                              {speechTranscript && (
                                <div className={`p-4 rounded-xl border transition-all ${
                                  (speechScore || 0) >= 80 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-905" 
                                    : (speechScore || 0) >= 40 
                                      ? "bg-amber-50 border-amber-205 text-amber-905" 
                                      : "bg-red-50 border-red-200 text-red-905"
                                }`}>
                                  <div className="flex justify-between items-start gap-3">
                                    <div>
                                      <span className="text-[9px] font-mono uppercase bg-white/50 px-2 py-0.5 rounded-md inline-block">
                                        RECOGNITION RESULT
                                      </span>
                                      <p className="text-sm font-bold mt-1.5 select-all">
                                        We heard: "{speechTranscript}"
                                      </p>
                                      <p className="text-xs mt-1 italic opacity-90">
                                        {speechFeedbackText}
                                      </p>
                                    </div>
                                    {speechScore !== null && (
                                      <div className={`px-2.5 py-1.5 rounded-lg font-mono font-black text-sm text-center border shrink-0 ${
                                        speechScore >= 80 
                                          ? "bg-emerald-100 border-emerald-300 text-emerald-700" 
                                          : speechScore >= 40 
                                            ? "bg-amber-100 border-amber-300 text-amber-700" 
                                            : "bg-red-100 border-red-300 text-red-700"
                                      }`}>
                                        {speechScore}%
                                        <div className="text-[7px] font-bold uppercase leading-none mt-0.5">Match</div>
                                      </div>
                                    )}
                                  </div>

                                  {speechScore !== null && speechScore >= 50 && (
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 mt-2 bg-emerald-100/40 p-1.5 rounded text-center">
                                      ✨ Gamified reward credited! +15 XP!
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Graceful iframe mic fallback / tutorial container */}
                              {unsupportedSpeechRecognition && (
                                <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl space-y-3">
                                  <div className="flex gap-2 items-start">
                                    <span className="text-sm mt-0.5">💡</span>
                                    <div>
                                      <p className="text-xs font-bold text-indigo-950">Sandboxed Iframe Microphone Note</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                        Browser speech capabilities might be withheld by IFrame parent sandbox parameters. You can test your enunciation aloud, or trigger the sandbox simulator by typing how you think the word is spoken/spelled to verify phonetic matches!
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2 mt-1">
                                    <input
                                      type="text"
                                      value={simulationTextInput}
                                      onChange={(e) => setSimulationTextInput(e.target.value)}
                                      placeholder="Type word to analyze phonetic match (e.g. Cześć)"
                                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#DC143C]"
                                    />
                                    <button
                                      onClick={() => handleSimulateSpeechCheck(simulationTextInput)}
                                      disabled={!simulationTextInput.trim()}
                                      className="py-2 px-4 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-lg text-xs tracking-wider uppercase cursor-pointer transition-colors disabled:opacity-50"
                                    >
                                      Phonetic Check
                                    </button>
                                  </div>

                                  <div className="flex justify-between items-center pt-1 flex-wrap gap-1">
                                    <button
                                      onClick={() => {
                                        handleSimulateSpeechCheck(selectedWordToPronounce.polish);
                                      }}
                                      className="text-[10px] font-semibold text-[#DC143C] hover:underline flex items-center gap-0.5 cursor-pointer text-left"
                                    >
                                      Or auto-simulate 100% Perfect Pronunciation (+15 XP) &rarr;
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>

                          </div>
                        ) : (
                          <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-400">
                            <Volume2 className="w-10 h-10 stroke-[1.5] animate-pulse" />
                            <p className="text-sm mt-2">No word focused.</p>
                          </div>
                        )}

                        {/* Summary button */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => {
                              setExerciseMode("standard");
                              setCurrentExerciseIdx(0);
                              setLessonStep("exercises");
                            }}
                            className="px-6 py-2.5 bg-slate-900 hover:bg-[#DC143C] text-white rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
                          >
                            Go to Exam Drills <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* B. ACTIVE EXERCISE SESSION */}
                {lessonStep === "exercises" && currentExercise && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 flex flex-col justify-between min-h-[420px]" id="exercise-session-host">
                    
                    {/* Progress tracking line */}
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-6">
                        <span className="uppercase tracking-widest font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {exerciseMode === "ai-generated" ? "✨ AI Generated Drill" : "Syllabus Challenge"}
                        </span>
                        <span>Question {currentExerciseIdx + 1} of {availableExercises.length}</span>
                      </div>

                      {/* Header block with task statement */}
                      <div className="space-y-2">
                        <h3 className="text-base text-slate-500 font-medium">
                          {currentExercise.instruction}
                        </h3>
                        {currentExercise.englishPrompt && (
                          <p className="text-sm text-slate-400 italic font-mono mt-1">
                            English to match: "{currentExercise.englishPrompt}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Variable render based on Exercise Type */}
                    <div className="my-8 flex flex-col items-center">
                      
                      {currentExercise.sentence && currentExercise.type === "fill-in-the-blank" && (
                        <div className="relative group mb-10 w-full text-center">
                          <h2 className="text-2xl md:text-3xl font-serif italic text-slate-800 select-all">
                            {currentExercise.sentence.includes("___") ? (
                              currentExercise.sentence.split("___").map((chunk, i, arr) => (
                                <React.Fragment key={i}>
                                  {chunk}
                                  {i < arr.length - 1 && (
                                    <span className="inline-block justify-center min-w-[80px] border-b-2 border-[#DC143C] mx-1 text-[#DC143C] font-sans not-italic font-bold">
                                      {checkedAnswer ? currentExercise.correctAnswer : (selectedOption || "...")}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))
                            ) : (
                              currentExercise.sentence
                            )}
                          </h2>
                          <div className="w-full h-0.5 bg-slate-100 absolute -bottom-3" />
                        </div>
                      )}

                      {currentExercise.type === "multiple-choice" && (
                        <div className="relative group mb-10 text-center">
                          <h2 className="text-3xl font-serif italic text-[#DC143C] select-all">
                            "{currentExercise.correctAnswer}"? No, translate:
                          </h2>
                          <p className="text-xl font-medium text-slate-750 mt-2">
                            "{currentExercise.englishPrompt}"
                          </p>
                          <div className="w-full h-0.5 bg-slate-150 absolute -bottom-3" />
                        </div>
                      )}

                      {currentExercise.type === "reorder" && (
                        <div className="w-full space-y-6">
                          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest pl-1 block text-center">
                            ASSEMBLE POLISH SENTENCE IN ORDER
                          </span>
                          
                          {/* Reordered items container */}
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-wrap gap-2 justify-center items-center min-h-[64px]">
                            {reorderedWords.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">Click scrambled pool word fragments in order...</span>
                            ) : (
                              reorderedWords.map((word, wIdx) => (
                                <button
                                  key={wIdx}
                                  disabled={checkedAnswer}
                                  onClick={() => {
                                    setReorderedWords(prev => prev.filter((_, idx) => idx !== wIdx));
                                  }}
                                  className="py-1.5 px-3 bg-[#DC143C] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#b01030] transition-colors flex items-center gap-1 shrink-0"
                                >
                                  {word} <X className="w-3 h-3 text-red-200" />
                                </button>
                              ))
                            )}
                          </div>

                          {/* Scrambled original pool */}
                          <div className="flex flex-wrap gap-2 justify-center">
                            {currentExercise.options.map((word) => {
                              const usedCount = reorderedWords.filter(x => x === word).length;
                              const originalCount = currentExercise.options.filter(x => x === word).length;
                              const isDepleted = usedCount >= originalCount;
                              
                              return (
                                <button
                                  key={word + Math.random()}
                                  disabled={checkedAnswer || isDepleted}
                                  onClick={() => {
                                    setReorderedWords(prev => [...prev, word]);
                                  }}
                                  className={`py-1.5 px-3 text-xs font-semibold border rounded-lg transition-all ${
                                    isDepleted
                                      ? "bg-slate-100 text-slate-350 border-slate-205 pointer-events-none"
                                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 active:scale-95 cursor-pointer"
                                  }`}
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Default dynamic option list layout */}
                      {currentExercise.type !== "reorder" && (
                        <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentExercise.options.map((option, idx) => {
                            const optionLetters = ["A", "B", "C", "D"];
                            const isSelected = selectedOption === option;
                            
                            return (
                              <button
                                key={option}
                                disabled={checkedAnswer}
                                onClick={() => setSelectedOption(option)}
                                className={`p-4 rounded-xl border-2 transition-all text-left flex justify-between items-center group cursor-pointer ${
                                  isSelected
                                    ? "border-[#DC143C] bg-red-50/20"
                                    : "border-slate-100 hover:border-slate-300 bg-white"
                                }`}
                              >
                                <div>
                                  <span className={`block text-[10px] font-bold uppercase mb-1 ${isSelected ? "text-[#DC143C]" : "text-slate-400"}`}>
                                    Option {optionLetters[idx] || "•"}
                                  </span>
                                  <p className="text-sm font-medium text-slate-800 select-all">{option}</p>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#DC143C] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>

                    {/* Result Alerts Panel */}
                    {checkedAnswer && (
                      <div className={`p-4 rounded-xl border mb-6 flex gap-3 transition-all ${
                        isAnswerCorrect 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                          : "bg-red-50 border-red-200 text-red-900"
                      }`}>
                        <div className="mt-0.5">
                          {isAnswerCorrect ? (
                            <Check className="w-5 h-5 text-emerald-650" />
                          ) : (
                            <X className="w-5 h-5 text-red-650" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold">
                            {isAnswerCorrect ? "Świetnie! Correct Answer (+15 XP)" : "Ojej! Incorrect Answer"}
                          </p>
                          <p className="text-xs text-slate-800">
                            <strong>Correct phrase:</strong> {currentExercise.correctAnswer}
                          </p>
                          <p className="text-xs leading-normal opacity-90 italic">
                            <strong>Rule Tip:</strong> {currentExercise.grammarHint}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action bar */}
                    <div className="mt-auto flex justify-between items-center pt-5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (confirm("Skip this check? You can revisit exercises any time.")) {
                            handleNextExercise();
                          }
                        }}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        Skip Exercise
                      </button>

                      {!checkedAnswer ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={currentExercise.type !== "reorder" && !selectedOption}
                          className={`px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest shadow-sm select-none ${
                            (currentExercise.type !== "reorder" && !selectedOption) || (currentExercise.type === "reorder" && reorderedWords.length === 0)
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-slate-900 text-white hover:bg-[#DC143C] transition-colors cursor-pointer"
                          }`}
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextExercise}
                          className="px-8 py-3.5 bg-slate-900 text-white rounded-lg hover:bg-[#DC143C] transition-colors font-bold uppercase text-xs tracking-widest shadow-sm select-none cursor-pointer"
                        >
                          Next Question
                        </button>
                      )}
                    </div>

                  </div>
                )}

                {/* C. LESSON COMPLETION SUMMARY STATS */}
                {lessonStep === "summary" && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6" id="lesson-stats-summary">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-2">
                      <Trophy className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-slate-800">Gratulacje!</h2>
                      <p className="text-xs font-mono uppercase text-[#DC143C] font-semibold tracking-widest">
                        YOU PASSED: {activeLessonObject.englishTitle}
                      </p>
                      <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                        You have unlocked the grammatical map for this topic! Your score has been credited with an engagement bonus.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-2xl font-black text-slate-900">
                          {lessonCorrectAnswersCount} / {availableExercises.length}
                        </div>
                        <span className="text-[10px] font-bold text-slate-450 uppercase">ACCURACY SCHEMA</span>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-emerald-600">+100 XP</div>
                        <span className="text-[10px] font-bold text-slate-450 uppercase">CHAPTER BONUS</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-3">
                      <button
                        onClick={() => {
                          setExerciseMode("standard");
                          setAiExercises(null);
                          setCurrentExerciseIdx(0);
                          setLessonCorrectAnswersCount(0);
                          setLessonStep("vocabulary");
                        }}
                        className="py-2.5 px-5 border border-slate-200 hover:border-slate-350 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Review Vocabulary
                      </button>

                      <button
                        onClick={() => {
                          setSelectedLessonId(null);
                          setCurrentTab("lessons");
                        }}
                        className="py-2.5 px-5 bg-[#DC143C] hover:bg-[#b01030] rounded-lg text-xs font-bold text-white uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Next Lesson
                      </button>
                    </div>
                  </div>
                )}

              </div>

            ) : currentTab === "dashboard" ? (

              /* ============= STUDY DASHBOARD INDEX VIEW ============= */
              <Dashboard
                lessons={POLISH_LESSONS}
                stats={stats}
                onSelectLesson={setSelectedLessonId}
                onNavigateToTab={setCurrentTab}
                onResetProgress={handleResetProgress}
              />

            ) : currentTab === "lessons" ? (

              /* ============= STUDY MAP SYLLABUS DIRECT VIEW ============= */
              <div className="space-y-6" id="syllabus-grid-wrapper">
                <div className="bg-white p-5 border border-slate-200 rounded-xl">
                  <h3 className="font-sans font-medium text-slate-800 text-sm">Course Outline and Completion Status</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Polish syntax has seven cases. Work your way sequentially through the five critical cases below to earn full graduation XP.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {POLISH_LESSONS.map((chap, idx) => {
                    const isPassed = stats.completedLessons.includes(chap.id);
                    return (
                      <div 
                        key={chap.id}
                        onClick={() => setSelectedLessonId(chap.id)}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all hover:shadow-xs cursor-pointer relative group flex flex-col md:flex-row gap-5 justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#DC143C] font-black uppercase bg-red-50 px-2 py-0.5 rounded">
                              UNIT {idx + 1}
                            </span>
                            {isPassed && (
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                CLEARED
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#DC143C] transition-colors leading-tight">
                            {chap.title} <span className="font-normal text-slate-400">({chap.englishTitle})</span>
                          </h3>

                          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                            {chap.grammarConcept}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 justify-between md:justify-end">
                          <div className="text-left md:text-right font-mono">
                            <div className="text-xs text-slate-400">Contains</div>
                            <div className="text-sm font-semibold text-slate-800">
                              {chap.words.length} nouns & verbs
                            </div>
                          </div>
                          
                          <button 
                            className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl text-slate-600 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLessonId(chap.id);
                            }}
                          >
                            <ArrowRight className="w-5 h-5 text-[#DC143C]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            ) : currentTab === "sandbox" ? (

              /* ============= AI GRAMMAR SANDBOX VIEW ============= */
              <div className="space-y-6" id="sandbox-workspace">
                
                {/* Upper description */}
                <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[10px] uppercase tracking-wider bg-red-50 text-[#DC143C] font-black font-mono px-2 py-1 rounded">
                    POLISH SYNTAX SCRUTINIZER
                  </span>
                  <p className="text-xs text-slate-500 leading-normal">
                    Type or paste any sentence in Polish. Gemini AI will immediately check your spelling, decline cases, assign structural parts of speech, and present feedback. Perfect for verifying manual exercises!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left formulation block */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase block pl-1">
                        Input Polish Sentence
                      </label>
                      <input 
                        type="text" 
                        value={sandboxSentence}
                        onChange={(e) => setSandboxSentence(e.target.value)}
                        placeholder="e.g., Mam czarnego kota we środę..."
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl p-3 text-base text-slate-800 outline-none transition-colors"
                      />

                      {/* Rapid templates tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-mono text-slate-400 block pl-0.5">Quick Examples (containing subtle gender/case mistakes!):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {sandboxTemplates.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSandboxSentence(t)}
                              className="text-[11px] font-mono hover:text-[#DC143C] text-slate-500 bg-slate-50 hover:bg-slate-100 py-1 px-2.5 rounded-md border border-slate-200/55 transition-colors cursor-pointer"
                            >
                              "{t}"
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleCheckGrammar}
                          disabled={checkingGrammar || !sandboxSentence.trim()}
                          className={`py-3 px-6 rounded-xl font-bold uppercase text-xs tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer ${
                            checkingGrammar || !sandboxSentence.trim()
                              ? "bg-slate-100 text-slate-400 pointer-events-none"
                              : "bg-[#DC143C] text-white hover:bg-[#b01030] shadow-sm shadow-red-100"
                          }`}
                        >
                          {checkingGrammar ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Analysing Case Agreements...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> Deep Grammar Check
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* AI ANALYTIC RESULTS */}
                    {sandboxResult ? (
                      <div className="space-y-4" id="sandbox-results-panel">
                        
                        {/* Overall verdict summary */}
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 w-2 h-full"
                            style={{ backgroundColor: sandboxResult.isCorrect ? "#10B981" : "#EF4444" }}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold uppercase text-slate-400">Verbal Feedback</span>
                            <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              sandboxResult.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-750"
                            }`}>
                              {sandboxResult.isCorrect ? "CLEAN SYNTAX" : "REVISION REQUIRED"}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-mono text-slate-450">ORIGINAL STRING:</p>
                            <p className="text-lg font-serif italic text-slate-800">"{sandboxResult.original}"</p>
                          </div>

                          {!sandboxResult.isCorrect && sandboxResult.corrected && (
                            <div className="mt-3 p-3.5 bg-indigo-50/40 border border-indigo-100/50 rounded-xl space-y-1">
                              <span className="text-[10px] font-mono text-indigo-700 font-bold block uppercase tracking-widest">
                                SUGGESTED CORRECTED VARIANT:
                              </span>
                              <p className="text-base font-serif italic font-bold text-slate-800">
                                "{sandboxResult.corrected}"
                              </p>
                            </div>
                          )}

                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                            <span className="text-[10px] font-mono text-slate-450 uppercase">LITERAL TRANSLATION:</span>
                            <p className="text-sm font-medium text-slate-700">
                              {sandboxResult.translation}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                              {sandboxResult.explanation}
                            </p>
                          </div>
                        </div>

                        {/* Word breakdown table */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                          <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 uppercase font-mono text-xs text-slate-400 font-bold tracking-widest">
                            Word-by-word Gender Agreement & Declension Keys
                          </div>
                          
                          <div className="divide-y divide-slate-100">
                            {sandboxResult.wordsBreakdown.map((item, idx) => (
                              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-base font-bold text-slate-900 select-all">{item.word}</span>
                                    <span className="text-xs text-slate-400 font-mono">({item.originalForm})</span>
                                  </div>
                                  <div className="flex gap-2 flex-wrap mt-1">
                                    <span className="text-[9px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                      {item.partOfSpeech}
                                    </span>
                                    {item.gender && item.gender !== "NA" && (
                                      <span className="text-[9px] font-mono uppercase bg-pink-50 px-1.5 py-0.5 rounded text-pink-700">
                                        {item.gender}
                                      </span>
                                    )}
                                    {item.grammaticalCase && item.grammaticalCase !== "NA" && (
                                      <span className="text-[9px] font-mono uppercase bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">
                                        {item.grammaticalCase} Case
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-605 max-w-sm md:text-right italic">
                                  {item.roleExplanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Learning tips calls */}
                        {sandboxResult.learningTips && sandboxResult.learningTips.length > 0 && (
                          <div className="bg-slate-900 text-[#DC143C] p-6 rounded-2xl space-y-3">
                            <h4 className="text-white font-semibold text-xs uppercase tracking-widest font-mono">
                              AI Academic Remediation Callout
                            </h4>
                            <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-350">
                              {sandboxResult.learningTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    ) : (
                      !checkingGrammar && (
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                          <Layers className="w-10 h-10 text-slate-300 stroke-[1.5] mx-auto mb-3" />
                          <p className="text-xs">No analysis computed yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                            Input a Polish sentence above to trigger real-time AI morphological decomposition!
                          </p>
                        </div>
                      )
                    )}

                  </div>

                  {/* Right side prompt library */}
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
                      <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                        Explain Grammar Concepts
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Select a concept profile below to parse details, termination matrices, and learning tables.
                      </p>

                      <div className="space-y-2">
                        {[
                          "Accusative Case (Biernik)",
                          "Genitive Case Negation (Dopełniacz)",
                          "Instrumental Case (Narzędnik)",
                          "Locative Case (Miejscownik)",
                          "Polish Verb Conjugation Styles"
                        ].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => handleFetchTopicExplanation(topic)}
                            className={`w-full text-left font-sans text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                              activeGrammarTopic === topic
                                ? "bg-red-50 text-[#DC143C] font-semibold border-red-200"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-150"
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Explainer card host */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[220px]">
                      {fetchingTopicExplanation ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                          <Loader2 className="w-6 h-6 animate-spin text-[#DC143C]" />
                          <p className="text-xs mt-2">Calling Polish grammar library...</p>
                        </div>
                      ) : customExplanation ? (
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">
                            COMPREHENSIVE EXPLANTATION MATRIX
                          </span>
                          <div className="text-xs text-slate-805 leading-relaxed whitespace-pre-line prose max-w-none">
                            {customExplanation}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center p-4">
                          <BookOpen className="w-8 h-8 text-slate-350 stroke-[1.5] mb-2" />
                          <p className="text-xs text-slate-405">No concept is pulled yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Click on any grammar topic above to instruct the AI tutor to draft full termination tables!
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>

            ) : currentTab === "chat" ? (

              /* ============= AI DIALOG WITH MAREK VIEW ============= */
              <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[580px] overflow-hidden" id="chat-workspace">
                
                {/* Chat window Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Visual representation of Marek partner */}
                    <div className="w-9 h-9 bg-slate-900 border border-slate-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                      M
                    </div>
                    <div>
                      <h3 className="font-sans font-medium text-slate-800 text-sm">Marek's Language Cafe</h3>
                      <span className="text-[10px] font-semibold text-emerald-600 block flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                        Practicing Conversational Polish
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Reset chat log?")) {
                        setChatHistory([
                          {
                            sender: "marek",
                            polish: "Cześć! Jestem Marek. Jak się masz? Chcesz porozmawiać o jedzeniu, pracy czy podróżach?",
                            english: "Hello! I am Marek. How are you doing? Do you want to talk about food, work, or travels?",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }
                        ]);
                        localStorage.removeItem("polish_tutor_chat");
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 py-1.5 px-3 border border-slate-200 hover:border-red-100 hover:bg-red-50 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    Clear Chat
                  </button>
                </div>

                {/* Messages pane */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/20" id="chat-messages-container">
                  {chatHistory.map((turn, index) => {
                    const isMarek = turn.sender === "marek";
                    return (
                      <div 
                        key={index} 
                        className={`flex gap-3 max-w-[85%] ${isMarek ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                      >
                        {isMarek && (
                          <div className="w-7 h-7 bg-slate-850 rounded-full flex items-center justify-center font-bold text-[10px] text-white uppercase shrink-0 mt-1 select-none">
                            M
                          </div>
                        )}
                        
                        <div className="space-y-1.5">
                          <div className={`p-4 rounded-2xl text-xs space-y-1 leading-normal ${
                            isMarek 
                              ? "bg-white text-slate-800 border border-slate-150 rounded-tl-none shadow-sm" 
                              : "bg-[#DC143C] text-white rounded-tr-none"
                          }`}>
                            <p className="font-sans text-[13px] select-all font-medium leading-relaxed">{turn.polish}</p>

                            {/* Side translation for Marek */}
                            {isMarek && turn.english && (
                              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-50 leading-relaxed font-mono">
                                [{turn.english}]
                              </p>
                            )}

                            <span className="text-[9px] opacity-40 float-right font-mono block select-none">
                              {turn.timestamp}
                            </span>
                            <div className="clear-both" />
                          </div>

                          {/* Polish Grammar Feedback card tucked directly under Marek's reply */}
                          {isMarek && turn.feedback && (
                            <div className="text-[11px] bg-indigo-50 border border-indigo-150/70 rounded-xl p-3 text-slate-705 ml-1 space-y-1">
                              <span className="font-mono font-bold text-indigo-705 uppercase block">
                                Marek's Live Feedback:
                              </span>
                              <p className="leading-normal">{turn.feedback}</p>
                              {turn.alternative && (
                                <p className="italic text-slate-800 mt-1">
                                  <strong>Suggested Rephrase:</strong> "{turn.alternative}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {sendingChat && (
                    <div className="flex gap-3 max-w-[85%] mr-auto">
                      <div className="w-7 h-7 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-[10px] animate-pulse">
                        M
                      </div>
                      <div className="p-3 bg-white border border-slate-150 text-slate-500 font-mono text-[10px] italic rounded-2xl rounded-tl-none flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DC143C]" /> Marek is replying...
                      </div>
                    </div>
                  )}

                  {chatError && (
                    <div className="text-center text-xs text-red-500 bg-red-50 rounded-xl p-3 border border-red-200">
                      Error: {chatError}
                    </div>
                  )}
                </div>

                {/* Message write pane */}
                <div className="p-4 border-t border-slate-150 bg-white">
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChatMessage();
                      }}
                      placeholder="Type your response in Polish here..."
                      className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs border border-slate-205 rounded-xl px-4 outline-none transition-all py-3 focus:border-[#DC143C]"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      disabled={!chatInput.trim() || sendingChat}
                      className={`px-5 rounded-xl font-bold uppercase tracking-widest text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer ${
                        !chatInput.trim() || sendingChat
                          ? "bg-slate-105 text-slate-400 pointer-events-none"
                          : "bg-[#DC143C] text-white hover:bg-[#b01030] shadow-sm shadow-red-105"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </div>
                </div>

              </div>

            ) : null}

          </div>

          {/* COL COLUMN 4: SIDE STATISTICS METRICS - Geometric Balance Standard */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6" id="secondary-sidebar-widgets">
            
            {/* 1. PROGRESS SQUARE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                Course Progress
              </h3>

              <div className="relative flex items-center justify-center py-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="58" 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    fill="transparent" 
                    className="text-slate-100" 
                  />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="58" 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray="364" 
                    strokeDashoffset={364 * (1 - stats.completedLessons.length / POLISH_LESSONS.length)} 
                    className="text-[#DC143C] transition-all duration-300" 
                    style={{ color: "#DC143C" }} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 select-all">
                    {Math.round((stats.completedLessons.length / POLISH_LESSONS.length) * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Chapters PASSED</span>
                </div>
              </div>

              {/* Progress metrics sub stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-xl font-bold text-slate-900 select-all">
                    {stats.completedLessons.length} / {POLISH_LESSONS.length}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Units Cleared
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900 select-all">
                    {stats.bookmarkedWords.length}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Pinned Card Chest
                  </div>
                </div>
              </div>
            </div>

            {/* 2. STREAK COUNTER ACCENT (CRIMSON/DEEP SLATE GEOMETRIC DESIGN) */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-md">
              <div className="relative z-10 space-y-1">
                <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Active Polish Streak
                </h3>
                
                <div className="flex items-end gap-2 pt-1">
                  <span className="text-5xl font-black font-sans leading-none select-all">{stats.streak}</span>
                  <span className="text-base font-bold text-[#DC143C] mb-1">DAYS</span>
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const isActive = i < stats.streak;
                    return (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded-sm ${isActive ? "bg-[#DC143C]" : "bg-slate-800"}`} 
                      />
                    );
                  })}
                </div>
                <p className="text-[10.5px] text-slate-400 pt-2">
                  Commitment is key! Completing exercises daily builds solid grammar reflexes.
                </p>
              </div>

              {/* Background elegant decoration */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#DC143C]/10 rounded-full pointer-events-none blur-xs" />
            </div>

            {/* 3. GRAMMAR INSIGHT WIDGET */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-xs" id="dynamic-insight-block">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                Grammar Tip of the Day
              </h3>

              <div className="flex gap-4">
                <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: "#DC143C" }} />
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {activeLessonObject ? `Reflexes for ${activeLessonObject.englishTitle}` : "The Locative Case (Miejscownik)"}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {activeLessonObject ? (
                      activeLessonObject.grammarConcept
                    ) : (
                      "Used to express locations or talking about a topic with preposition 'o' (about). Feminine nouns often change to end in '-e' or '-i'."
                    )}
                  </p>
                  
                  {activeLessonObject ? (
                    <div className="text-[10px] font-mono bg-slate-50 p-2 border border-slate-100 rounded text-slate-500 whitespace-pre-wrap leading-tight">
                      Focus: {activeLessonObject.grammarFocus}
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono bg-slate-50 p-2 border border-slate-100 rounded text-slate-500 leading-tight">
                      kot &rarr; o kocie<br />Polska &rarr; w Polsce
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
