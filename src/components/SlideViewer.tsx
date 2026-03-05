import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Terminal as TerminalIcon, Info, Code2, TerminalSquare, Blocks, Monitor, Box, HardDrive, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { slidesData } from '../slidesData';

interface SlideViewerProps {
  topicId: number;
  topicTitle: string;
  hasNextTopic: boolean;
  hasPrevTopic: boolean;
  startAtEnd?: boolean;
  initialSlideIndex?: number;
  nextTopicIsProject?: boolean;
  nextTopicIsNewChapter?: boolean;
  prevTopicIsNewChapter?: boolean;
  onClose: () => void;
  onNextTopic: () => void;
  onPrevTopic: () => void;
  onCompleteTopic: () => void;
  onSlideChange?: (topicId: number, slideIndex: number) => void;
}

export default function SlideViewer({ topicId, topicTitle, hasNextTopic, hasPrevTopic, startAtEnd, initialSlideIndex, nextTopicIsProject, nextTopicIsNewChapter, prevTopicIsNewChapter, onClose, onNextTopic, onPrevTopic, onCompleteTopic, onSlideChange }: SlideViewerProps) {
  const slides = slidesData[topicId] || [];
  const initialIndex = startAtEnd ? Math.max(0, slides.length - 1) : (initialSlideIndex || 0);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [currentTopicId, setCurrentTopicId] = React.useState(topicId);

  let activeIndex = currentIndex;
  // Synchronously reset index when topic changes to prevent out-of-bounds errors
  if (topicId !== currentTopicId) {
    setCurrentTopicId(topicId);
    setCurrentIndex(initialIndex);
    activeIndex = initialIndex;
  }

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    if (onSlideChange) {
      onSlideChange(topicId, activeIndex);
    }
  }, [activeIndex, topicId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (activeIndex < slides.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onCompleteTopic();
          onNextTopic();
        }
      }
      if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        } else if (hasPrevTopic) {
          onPrevTopic();
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slides.length, hasPrevTopic, onCompleteTopic, onNextTopic, onPrevTopic, onClose]);

  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4 font-semibold text-slate-800">No hay diapositivas para este tema aún.</h2>
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium text-white"
          >
            Volver al curso
          </button>
        </div>
      </div>
    );
  }

  const isLastSlide = activeIndex === slides.length - 1;

  const nextSlide = () => {
    if (!isLastSlide) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onCompleteTopic();
      onNextTopic();
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (hasPrevTopic) {
      onPrevTopic();
    }
  };

  const currentSlide = slides[activeIndex];
  if (!currentSlide) return null;

  const progress = ((activeIndex + 1) / slides.length) * 100;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-8 h-8" />;
      case 'TerminalSquare': return <TerminalSquare className="w-8 h-8" />;
      case 'Blocks': return <Blocks className="w-8 h-8" />;
      case 'Monitor': return <Monitor className="w-8 h-8" />;
      case 'Box': return <Box className="w-8 h-8" />;
      case 'HardDrive': return <HardDrive className="w-8 h-8" />;
      default: return <Info className="w-8 h-8" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 md:p-6 shrink-0 border-b border-slate-100">
        <div className="flex flex-col">
          <div className="text-slate-800 font-semibold mb-0.5">{topicTitle}</div>
          <div className="text-slate-500 text-xs font-medium tracking-wider uppercase">
            Diapositiva {activeIndex + 1} de {slides.length}
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Cerrar presentación (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Content */}
      <div ref={scrollRef} className="flex-1 flex items-start justify-center p-6 md:p-12 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${topicId}-${activeIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-5xl my-auto"
          >
            {/* Progress Tracker */}
            <div className="flex gap-2 mb-8 md:mb-12">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full flex-1 max-w-[60px] transition-colors duration-300 ${idx <= activeIndex ? 'bg-red-600' : 'bg-slate-200'}`} 
                />
              ))}
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-slate-900 tracking-tight">
              {currentSlide.title}
            </h2>
            
            <div className={`grid grid-cols-1 ${currentSlide.code || currentSlide.terminal ? 'lg:grid-cols-2' : ''} gap-8 lg:gap-12 items-start`}>
              <div className="space-y-6 text-lg md:text-xl text-slate-700 leading-relaxed">
                {currentSlide.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
                
                {currentSlide.table && (
                  <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          {currentSlide.table.headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-3">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentSlide.table.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50/50">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className={`px-4 py-3 ${cellIdx === 0 ? 'font-mono font-medium text-red-600' : 'text-slate-600'}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {currentSlide.note && (
                  <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
                    <Info className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Nota:</strong> {currentSlide.note}
                    </p>
                  </div>
                )}
                
                {currentSlide.reference && (
                  <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                    <BookOpen className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-500 italic">
                      Referencia: {currentSlide.reference}
                    </p>
                  </div>
                )}

                {currentSlide.solutionUrl && (
                  <div className="mt-8">
                    <a 
                      href={currentSlide.solutionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      <Github className="w-5 h-5" />
                      Ver solución en GitHub
                    </a>
                  </div>
                )}
              </div>

              {currentSlide.cards && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 lg:col-span-full">
                  {currentSlide.cards.map((card, idx) => {
                    const CardContent = (
                      <div className="h-full p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                          {renderIcon(card.icon)}
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">{card.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
                      </div>
                    );

                    if (card.link) {
                      return (
                        <a key={idx} href={card.link} target="_blank" rel="noopener noreferrer" className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl">
                          {CardContent}
                        </a>
                      );
                    }

                    return <div key={idx} className="h-full">{CardContent}</div>;
                  })}
                </div>
              )}

              {(currentSlide.code || currentSlide.terminal) && (
                <div className="space-y-6">
                  {currentSlide.code && (
                    <div className="rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full bg-slate-50">
                      <SyntaxHighlighter 
                        language="java" 
                        style={prism} 
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.95rem' }}
                        wrapLines={true}
                      >
                        {currentSlide.code}
                      </SyntaxHighlighter>
                    </div>
                  )}

                  {currentSlide.terminal && (
                    <div className="rounded-xl shadow-sm border border-slate-800 overflow-hidden w-full bg-[#0d1117]">
                      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                        <TerminalIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-mono text-slate-400">Terminal</span>
                      </div>
                      <pre className="p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                        <code>{currentSlide.terminal}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Bar / Navigation */}
      <div className="p-4 md:p-6 flex items-center justify-between shrink-0 relative bg-white/90 backdrop-blur-sm border-t border-slate-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button 
          onClick={prevSlide}
          disabled={activeIndex === 0 && !hasPrevTopic}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-colors ${activeIndex === 0 && !hasPrevTopic ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">{activeIndex === 0 && hasPrevTopic ? (prevTopicIsNewChapter ? 'Capítulo Anterior' : 'Tema Anterior') : 'Anterior'}</span>
        </button>
        
        <button 
          onClick={nextSlide}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-colors ${isLastSlide ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <span className="hidden sm:inline">
            {isLastSlide ? (hasNextTopic ? (nextTopicIsNewChapter ? 'Siguiente Capítulo' : (nextTopicIsProject ? 'Practicar' : 'Siguiente Tema')) : 'Finalizar Curso') : 'Siguiente'}
          </span> 
          {isLastSlide && !hasNextTopic ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
