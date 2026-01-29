import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Check, Clock, Play, Pause, Volume2, Cross, Loader2, Mic } from 'lucide-react';
import { Button } from './ui/Button';
import { QuizProps, UserData, QuizStep } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

// Workaround for TypeScript errors with framer-motion types
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

export const Quiz: React.FC<QuizProps> = ({ onComplete, onDashboardRequest }) => {
  const [step, setStep] = useState<QuizStep>('intro');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    assessment: '',
    routine: '',
    intention: ''
  });

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Prevents UI jitter while dragging

  // States for Transition/Loading Animation
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Analytics hook
  const { trackVisit, trackStep, trackInteraction, ignoreCurrentSession } = useAnalytics();

  // Track visit on mount
  useEffect(() => {
    trackVisit();
  }, []);

  // Track step changes and handle Transition Animation
  useEffect(() => {
    trackStep(step);

    if (step === 'transition') {
      setIsGenerating(true);
      setGenerationProgress(0);

      // Simulation of personalized generation
      const timer1 = setTimeout(() => setGenerationProgress(25), 500);  // Start
      const timer2 = setTimeout(() => setGenerationProgress(60), 1500); // Analyze
      const timer3 = setTimeout(() => setGenerationProgress(85), 2500); // Compile
      const timer4 = setTimeout(() => setGenerationProgress(100), 3200); // Finish
      const timer5 = setTimeout(() => setIsGenerating(false), 3800);    // Show Result

      return () => {
        clearTimeout(timer1); clearTimeout(timer2);
        clearTimeout(timer3); clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [step]);

  // Helper to advance steps
  const nextStep = (next: QuizStep) => {
    trackInteraction();
    setStep(next);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackInteraction();

    const rawInput = userData.name.trim();

    // SECRET DASHBOARD ACCESS
    if (rawInput === 'enter_dashboard') {
      await ignoreCurrentSession();
      onDashboardRequest();
      return;
    }

    if (rawInput.length > 0) {
      // Logic: Use only first name for the rest of the funnel
      // We split by space and take the first element
      const firstName = rawInput.split(' ')[0];

      // We update the state with just the first name so subsequent screens use it
      setUserData(prev => ({ ...prev, name: firstName }));

      nextStep('assessment');
    }
  };

  const handleOptionSelect = (key: keyof UserData, value: string, next: QuizStep) => {
    trackInteraction();
    setUserData(prev => ({ ...prev, [key]: value }));
    setTimeout(() => nextStep(next), 250);
  };

  // Audio Handlers
  const toggleAudio = () => {
    trackInteraction();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    // Only update state from audio engine if user is NOT dragging the slider
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      const seconds = audioRef.current.duration;
      // Filter out invalid durations
      if (!isNaN(seconds) && seconds !== Infinity) {
        setDuration(seconds);
      }
    }
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsDragging(false);
    // Ensure the audio jumps to the final position when drag ends
    if (audioRef.current) {
      const target = e.currentTarget as HTMLInputElement;
      audioRef.current.currentTime = Number(target.value);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time); // Immediate UI update

    // Optional: Update audio continuously while dragging. 
    // If it causes stutter, move this to handleSeekEnd. 
    // Usually, modern browsers handle this fine.
    if (audioRef.current) {
      const diff = Math.abs(audioRef.current.currentTime - time);
      // Only force update audio if difference is significant to avoid micro-stutters
      if (diff > 0.2) {
        audioRef.current.currentTime = time;
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    trackInteraction();
    nextStep('name');
  };

  const finishQuiz = () => {
    trackInteraction();
    onComplete(userData.name);
  };

  // Progress calculation for the top bar
  const getProgress = () => {
    switch (step) {
      case 'intro': return 0;
      case 'name': return 15;
      case 'assessment': return 30;
      case 'routine': return 45;
      case 'intention': return 60;
      case 'audio_message': return 80;
      case 'transition': return 100;
      default: return 0;
    }
  };

  // Helper text for the loading screen
  const getLoadingText = () => {
    if (generationProgress < 30) return "Analisando seu perfil espiritual...";
    if (generationProgress < 70) return "Selecionando práticas quaresmais...";
    if (generationProgress < 95) return "Compilando seu itinerário diário...";
    return "Finalizando...";
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.02 }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-center items-center p-4 md:p-6 relative overflow-hidden bg-paper-texture">

      {/* Decorative Border Frame (Fixed on screen) */}
      <div className="absolute inset-2 border-2 border-gold-700/20 pointer-events-none rounded-lg z-0" />
      <div className="absolute inset-3 border border-gold-700/10 pointer-events-none rounded-lg z-0" />

      {/* Background Ambience - Classic Cross Pattern */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="cross-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 15v30M15 30h30" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-900" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cross-pattern)" />
        </svg>
      </div>

      <div className="w-full max-w-lg bg-paper-50 rounded-lg shadow-2xl overflow-hidden border-4 border-double border-stone-200 relative z-10">

        {/* Progress Bar (Gold Line) - Hides on transition to use custom one */}
        {step !== 'intro' && step !== 'transition' && (
          <div className="w-full bg-stone-200 h-1 border-b border-stone-300">
            <div
              className="bg-gold-700 h-1 transition-all duration-700 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        )}

        <div className="p-8 md:p-12 min-h-[450px] flex flex-col justify-center relative">

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-700/30 opacity-50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-700/30 opacity-50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-700/30 opacity-50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-700/30 opacity-50" />

          <AnimatePresence mode="wait">

            {/* Screen 1: Intro */}
            {step === 'intro' && (
              <MotionDiv
                key="intro"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="text-center space-y-6"
              >

                <div>
                  <h1 className="text-3xl font-serif font-bold text-stone-900 leading-tight tracking-tight mb-2">
                    Seja bem-vindo ao <br />
                    <span className="text-purple-900">Guia Quaresmal 2026</span>
                  </h1>

                  {/* Imagem Temática - Moved immediately below title */}
                  <div className="relative w-full h-48 my-6 rounded-sm overflow-hidden border border-gold-700/30 shadow-md">
                    <img
                      src="https://i.ibb.co/PXPWPtP/mock.png"
                      alt="Ambiente Sacro de Oração"
                      className="w-full h-full object-cover opacity-90 sepia-[0.3]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-paper-50 via-transparent to-transparent opacity-10"></div>
                  </div>

                  <div className="w-16 h-1 bg-gold-700 mx-auto rounded-full opacity-50 mb-6" />

                  <p className="text-stone-700 text-lg font-sans leading-relaxed">
                    Durante esta jornada, você será guiado diariamente com <strong>orações, reflexões e desafios espirituais</strong> para fortalecer sua fé e preparar verdadeiramente sua alma para a Páscoa.
                  </p>

                  <p className="text-stone-500 text-sm font-sans italic mt-3">
                    Para começarmos, responda a este breve exame espiritual.
                  </p>
                </div>

                <div className="pt-2">
                  <Button fullWidth onClick={startQuiz} className="text-lg shadow-purple-900/30 py-4">
                    INICIAR
                  </Button>
                  <div className="mt-4 flex justify-center items-center text-stone-400 text-xs font-sans uppercase tracking-widest">
                    <Clock className="w-3 h-3 mr-2" />
                    Tempo: 2 minutos
                  </div>
                </div>
              </MotionDiv>
            )}

            {/* Screen 2: Name */}
            {step === 'name' && (
              <MotionDiv
                key="name"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-8"
              >
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 text-center">
                  Qual seu Nome?
                </h2>
                <form onSubmit={handleNameSubmit} className="space-y-8">
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Seu nome de batismo"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-stone-300 py-4 text-2xl text-center font-serif text-purple-900 focus:outline-none focus:border-purple-900 placeholder-stone-300 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 p-6 bg-paper-200/50 border border-stone-200 rounded-sm text-stone-700 text-base text-center">
                    <BookOpen className="w-6 h-6 text-gold-700 mb-1" />
                    <p>Ele será incluído no <strong>Livro de Orações</strong> desta semana.</p>
                  </div>
                  <Button type="submit" fullWidth disabled={!userData.name.trim()}>
                    Prosseguir
                  </Button>
                </form>
              </MotionDiv>
            )}

            {/* Screen 3: Auto-Assessment */}
            {step === 'assessment' && (
              <MotionDiv
                key="assessment"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-2xl font-serif font-bold text-stone-900 leading-snug">
                  Ao olhar para suas Quaresmas passadas, o que seu coração diz?
                </h2>
                <div className="space-y-3">
                  {[
                    "Começo com fervor, mas o mundo me vence",
                    "Fico perdido, sem saber qual penitência escolher",
                    "Cumpro as regras, mas meu coração continua frio",
                    "Já vivo bem, mas sinto que Deus pede mais",
                    "Sinto-me morno e distante da Graça"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('assessment', option, 'routine')}
                      className="w-full text-left p-5 rounded-sm border border-stone-300 bg-white/50 hover:border-purple-900 hover:bg-purple-50 transition-all group flex items-center justify-between shadow-sm"
                    >
                      <span className="text-lg text-stone-800 font-sans group-hover:text-purple-900">{option}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-purple-900 transition-colors" />
                    </button>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* Screen 4: Routine */}
            {step === 'routine' && (
              <MotionDiv
                key="routine"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Como é o seu tempo hoje?
                </h2>
                <p className="text-stone-600 italic -mt-4">Para que a penitência seja real, ela deve caber na vida.</p>
                <div className="space-y-3">
                  {[
                    "Avassalador, quase sem respiro",
                    "Cheio, mas com breves momentos de silêncio",
                    "Organizado e previsível",
                    "Caótico e variável dia a dia"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('routine', option, 'intention')}
                      className="w-full text-left p-5 rounded-sm border border-stone-300 bg-white/50 hover:border-purple-900 hover:bg-purple-50 transition-all group shadow-sm"
                    >
                      <span className="text-lg text-stone-800 font-sans group-hover:text-purple-900">{option}</span>
                    </button>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* Screen 5: Intention */}
            {step === 'intention' && (
              <MotionDiv
                key="intention"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Qual graça principal você suplica a Deus para estes 40 dias?
                </h2>
                <div className="space-y-3">
                  {[
                    "Restaurar minha intimidade perdida com Ele",
                    "Vencer um vício que me escraviza",
                    "Adquirir a virtude da constância",
                    "Encontrar paz em meio à tribulação",
                    "Preparar minha alma para a Ressurreição"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('intention', option, 'audio_message')}
                      className="w-full text-left p-5 rounded-sm border border-stone-300 bg-white/50 hover:border-purple-900 hover:bg-purple-50 transition-all group shadow-sm"
                    >
                      <span className="text-lg text-stone-800 font-sans group-hover:text-purple-900">{option}</span>
                    </button>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* Screen 6: Audio Message (Custom Layout based on provided snippet) */}
            {step === 'audio_message' && (
              <MotionDiv
                key="audio_message"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="text-center space-y-8"
              >
                <div className="mx-auto w-16 h-16 border border-gold-700/30 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br from-paper-100 to-paper-300">
                  <Volume2 className="w-8 h-8 text-gold-800" />
                </div>

                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Uma palavra para ti, <span className="text-purple-900">{userData.name}</span>
                </h2>

                <p className="text-stone-700 text-lg font-sans">
                  Antes de revelarmos o caminho, ouça esta breve <strong>oração</strong>.
                </p>

                {/* --- CUSTOM AUDIO PLAYER START --- */}
                <div className="max-w-md mx-auto mt-6 flex items-start gap-4">

                  {/* 1. User/Avatar (Outside, Left) */}
                  <div className="relative shrink-0 mt-1">
                    <img
                      src="https://i.ibb.co/BKqVJNs5/frei.png"
                      alt="Frei"
                      className="w-14 h-14 rounded-full object-cover border border-stone-200"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <Mic className={`w-5 h-5 ${isPlaying ? 'text-green-500' : 'text-stone-400'}`} />
                    </div>
                  </div>

                  {/* 2. Player Body (Light Gray Bubble) */}
                  <div className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-3 shadow-sm flex items-center gap-3 min-w-0">

                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={toggleAudio}
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors focus:outline-none"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-stone-500 fill-current" />
                      ) : (
                        <Play className="w-8 h-8 text-stone-500 fill-current ml-1" />
                      )}
                    </button>

                    {/* Timeline */}
                    <div className="flex-1 flex flex-col justify-center min-w-0 pt-1">
                      {/* Slider Line */}
                      <div className="relative w-full h-4 flex items-center group">
                        {/* Input Range */}
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeekChange}
                          onMouseDown={handleSeekStart}
                          onMouseUp={handleSeekEnd}
                          onTouchStart={handleSeekStart}
                          onTouchEnd={handleSeekEnd}
                          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {/* Visual Track Background */}
                        <div className="w-full h-1.5 bg-stone-300 rounded-full overflow-hidden relative z-0">
                          {/* Progress Fill */}
                          <div
                            className="h-full bg-purple-900 transition-all duration-100 ease-linear"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          ></div>
                        </div>

                        {/* Visual Thumb (Circle) - Always visible or on hover? WhatsApp is always visible but small */}
                        <div
                          className="absolute w-3.5 h-3.5 bg-purple-900 rounded-full shadow-md z-10 pointer-events-none transform -translate-x-1/2 transition-all duration-100 ease-linear border-2 border-white"
                          style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>

                      {/* Data / Time */}
                      <div className="flex justify-between text-[11px] text-stone-500 font-sans mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <div className="flex items-center gap-1">
                          <span>{formatTime(duration)}</span>
                          {/* Optional Check Icon based on snippet idea */}
                          {currentTime >= duration && duration > 0 && <Check className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    ref={audioRef}
                    src="/frei.mp3?v=2"
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={updateDuration}
                    onDurationChange={updateDuration}
                    onError={(e) => console.error("Erro ao carregar áudio:", e)}
                  />
                </div>
                {/* --- CUSTOM AUDIO PLAYER END --- */}

                <div className="pt-8">
                  <Button fullWidth onClick={() => nextStep('transition')} size="lg" className="border-gold-700/50">
                    Prosseguir
                  </Button>
                </div>
              </MotionDiv>
            )}

            {/* Screen 7: Transition (Generating or Done) */}
            {step === 'transition' && (
              <MotionDiv
                key="transition"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="text-center w-full max-w-sm mx-auto flex flex-col justify-center min-h-[300px]"
              >
                {isGenerating ? (
                  // STATE 1: GENERATING
                  <div className="space-y-8">
                    <h2 className="text-xl font-serif font-bold text-stone-800">
                      Criando seu plano...
                    </h2>

                    {/* Personalized Progress Bar */}
                    <div className="relative pt-2">
                      <div className="h-2 bg-stone-200 rounded-full overflow-hidden w-full">
                        <MotionDiv
                          className="h-full bg-gradient-to-r from-purple-800 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${generationProgress}%` }}
                          transition={{ ease: "easeInOut", duration: 0.8 }}
                        />
                      </div>
                      <MotionP
                        key={getLoadingText()} // Animate text change
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-stone-500 text-sm font-sans mt-3 italic"
                      >
                        {getLoadingText()}
                      </MotionP>
                    </div>

                    <div className="opacity-50">
                      <Loader2 className="w-8 h-8 text-gold-700 animate-spin mx-auto" />
                    </div>
                  </div>
                ) : (
                  // STATE 2: DONE (CHECK + CTA)
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10 flex flex-col items-center"
                  >
                    <MotionDiv
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="w-24 h-24 bg-paper-100 border-4 border-double border-green-700/30 rounded-full flex items-center justify-center mb-2 shadow-xl"
                    >
                      <Check className="w-12 h-12 text-green-800" />
                    </MotionDiv>

                    <div>
                      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
                        Tudo está pronto, <span className="text-purple-900">{userData.name}</span>.
                      </h2>
                      <div className="w-24 h-0.5 bg-stone-300 mx-auto mb-6" />

                      {/* COPY UPDATED HERE */}
                      <p className="text-stone-700 text-xl font-sans leading-relaxed max-w-md mx-auto">
                        Com base nas suas informações, traçamos um guia fiel à Tradição e possível para tua vida.
                      </p>
                    </div>

                    <div className="pt-4 w-full">
                      <Button
                        variant="secondary"
                        fullWidth
                        size="lg"
                        className="shadow-2xl shadow-red-900/20 text-lg py-5 border-2 border-white/10"
                        onClick={finishQuiz}
                      >
                        Abrir Guia Quaresmal
                      </Button>
                    </div>

                    <p className="text-xs text-stone-500 font-serif italic flex items-center justify-center gap-1 opacity-70">
                      Confidencialidade Sacra <span className="text-stone-300">|</span> Ad Majorem Dei Gloriam
                    </p>
                  </MotionDiv>
                )}
              </MotionDiv>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};