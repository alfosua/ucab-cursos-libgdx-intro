import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, PlayCircle, BookOpen, Play, RotateCcw, Github, Gamepad2 } from 'lucide-react';
import SlideViewer from './components/SlideViewer';

type Status = 'not-started' | 'in-progress' | 'completed';

interface CourseItem {
  id: number;
  module: string;
  topic: string;
  description: string;
  status: Status;
  link: string;
}

const initialData: CourseItem[] = [
  { id: 1, module: '1. Preparando la Aventura', topic: '¿Qué es LibGDX?', description: 'Conceptos básicos y configuración del entorno de desarrollo.', status: 'not-started', link: '#' },
  { id: 2, module: '1. Preparando la Aventura', topic: 'Estructura del Proyecto', description: 'Módulos principales y el ciclo de vida (ApplicationAdapter).', status: 'not-started', link: '#' },
  { id: 3, module: '2. El Protagonista', topic: 'Dibujando al Entrenador', description: 'Carga y renderizado de imágenes con SpriteBatch y Texture.', status: 'not-started', link: '#' },
  { id: 4, module: '2. El Protagonista', topic: 'Animando el Caminado', description: 'Uso de SpriteSheets y la clase Animation.', status: 'not-started', link: '#' },
  { id: 5, module: '2. El Protagonista', topic: 'Movimiento en Cuadrícula', description: 'Manejo de Input y desplazamiento tile por tile (Grid-based).', status: 'not-started', link: '#' },
  { id: 6, module: '3. Explorando la Región', topic: 'La Cámara del Jugador', description: 'Uso de OrthographicCamera para seguir al protagonista.', status: 'not-started', link: '#' },
  { id: 7, module: '3. Explorando la Región', topic: 'Creando el Mapa', description: 'Diseño de mapas ortogonales usando Tiled Map Editor.', status: 'not-started', link: '#' },
  { id: 8, module: '3. Explorando la Región', topic: 'Renderizando el Entorno', description: 'Carga y dibujo del mapa con OrthogonalTiledMapRenderer.', status: 'not-started', link: '#' },
  { id: 9, module: '3. Explorando la Región', topic: 'Colisiones con Obstáculos', description: 'Evitando que el jugador atraviese árboles y casas.', status: 'not-started', link: '#' },
  { id: 10, module: '4. Arquitectura del Juego', topic: 'Múltiples Pantallas', description: 'Transición entre el Menú Principal y el Mundo (Game y Screen).', status: 'not-started', link: '#' },
  { id: 11, module: '4. Arquitectura del Juego', topic: 'Gestión de Recursos', description: 'Carga eficiente de texturas y sonidos con AssetManager.', status: 'not-started', link: '#' },
  { id: 12, module: '4. Arquitectura del Juego', topic: 'Interfaz con Scene2D', description: 'Creación del botón de jugar para transicionar al juego.', status: 'not-started', link: '#' },
  { id: 13, module: '5. ¡Batalla Pokémon!', topic: 'Transición al Combate', description: 'Efectos visuales al encontrar un monstruo salvaje en la hierba.', status: 'not-started', link: '#' },
  { id: 14, module: '5. ¡Batalla Pokémon!', topic: 'Pantalla de Combate', description: 'Estructura por turnos y menú de ataques.', status: 'not-started', link: '#' },
  { id: 15, module: '5. ¡Batalla Pokémon!', topic: 'Música y Efectos', description: 'Añadiendo la banda sonora y sonidos de ataques.', status: 'not-started', link: '#' },
  { id: 16, module: '6. Liga Pokémon', topic: 'Pulido y Exportación', description: 'Detalles finales y empaquetado del juego para PC y Android.', status: 'not-started', link: '#' },
];

export default function App() {
  const [data, setData] = useState<CourseItem[]>(() => {
    const saved = localStorage.getItem('courseData');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const [startAtEnd, setStartAtEnd] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{targetId: number, module: string, startAtEnd: boolean} | null>(null);
  const [lastSeen, setLastSeen] = useState<{topicId: number, slideIndex: number} | null>(() => {
    const saved = localStorage.getItem('lastSeen');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('courseData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (lastSeen) {
      localStorage.setItem('lastSeen', JSON.stringify(lastSeen));
    } else {
      localStorage.removeItem('lastSeen');
    }
  }, [lastSeen]);

  useEffect(() => {
    if (activeTopicId !== null) {
      document.body.style.overflow = 'hidden';
      setData(prev => prev.map(item => 
        (item.id === activeTopicId && item.status === 'not-started') 
          ? { ...item, status: 'in-progress' } 
          : item
      ));
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeTopicId]);

  const toggleStatus = (id: number) => {
    setData(data.map(item => {
      if (item.id === id) {
        const nextStatus: Record<Status, Status> = {
          'not-started': 'in-progress',
          'in-progress': 'completed',
          'completed': 'not-started'
        };
        return { ...item, status: nextStatus[item.status] };
      }
      return item;
    }
    ));
  };

  const handleCompleteTopic = (id: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    ));
  };

  useEffect(() => {
    if (pendingTransition) {
      const timer = setTimeout(() => {
        setStartAtEnd(pendingTransition.startAtEnd);
        setActiveTopicId(pendingTransition.targetId);
        setPendingTransition(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [pendingTransition]);

  const skipTransition = () => {
    if (pendingTransition) {
      setStartAtEnd(pendingTransition.startAtEnd);
      setActiveTopicId(pendingTransition.targetId);
      setPendingTransition(null);
    }
  };

  const navigateToTopic = (targetId: number, currentId: number | null, startAtEndFlag: boolean = false, showTransition: boolean = true) => {
    const target = data.find(t => t.id === targetId);
    const current = currentId ? data.find(t => t.id === currentId) : null;

    if (showTransition && target && (!current || current.module !== target.module)) {
      setActiveTopicId(null);
      setPendingTransition({ targetId, module: target.module, startAtEnd: startAtEndFlag });
    } else {
      setStartAtEnd(startAtEndFlag);
      setActiveTopicId(targetId);
    }
  };

  const handleNextTopic = (currentId: number) => {
    const currentIndex = data.findIndex(item => item.id === currentId);
    if (currentIndex >= 0 && currentIndex < data.length - 1) {
      navigateToTopic(data[currentIndex + 1].id, currentId, false, true);
    } else {
      setActiveTopicId(null);
      setShowCreditsModal(true);
    }
  };

  const handlePrevTopic = (currentId: number) => {
    const currentIndex = data.findIndex(item => item.id === currentId);
    if (currentIndex > 0) {
      navigateToTopic(data[currentIndex - 1].id, currentId, true, true);
    }
  };

  const handleStartContinue = () => {
    if (lastSeen) {
      navigateToTopic(lastSeen.topicId, null, false, true);
    } else {
      const firstPending = data.find(item => item.status !== 'completed');
      navigateToTopic(firstPending ? firstPending.id : data[0].id, null, false, true);
    }
  };

  const handleResetProgress = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setData(initialData);
    setLastSeen(null);
    localStorage.removeItem('courseData');
    localStorage.removeItem('lastSeen');
    setShowResetConfirm(false);
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4" />;
      case 'not-started': return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En progreso';
      case 'not-started': return 'No iniciado';
    }
  };

  const getStatusBadgeClass = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20';
      case 'not-started': return 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200';
    }
  };

  const progress = Math.round((data.filter(d => d.status === 'completed').length / data.length) * 100);
  const activeTopic = activeTopicId ? data.find(t => t.id === activeTopicId) : null;
  const activeTopicIndex = activeTopicId ? data.findIndex(t => t.id === activeTopicId) : -1;
  const nextTopic = activeTopicIndex >= 0 && activeTopicIndex < data.length - 1 ? data[activeTopicIndex + 1] : null;
  const prevTopic = activeTopicIndex > 0 ? data[activeTopicIndex - 1] : null;
  const nextTopicIsProject = nextTopic ? nextTopic.topic.includes('Proyecto') : false;
  const nextTopicIsNewChapter = nextTopic && activeTopic ? nextTopic.module !== activeTopic.module : false;
  const prevTopicIsNewChapter = prevTopic && activeTopic ? prevTopic.module !== activeTopic.module : false;

  return (
    <>
      {activeTopicId !== null && activeTopic && (
        <SlideViewer 
          topicId={activeTopicId}
          topicTitle={`${activeTopic.module}: ${activeTopic.topic}`}
          hasNextTopic={activeTopicId !== data[data.length - 1].id}
          hasPrevTopic={activeTopicId !== data[0].id}
          startAtEnd={startAtEnd}
          initialSlideIndex={lastSeen?.topicId === activeTopicId && !startAtEnd ? lastSeen.slideIndex : 0}
          nextTopicIsProject={nextTopicIsProject}
          nextTopicIsNewChapter={nextTopicIsNewChapter}
          prevTopicIsNewChapter={prevTopicIsNewChapter}
          onClose={() => setActiveTopicId(null)} 
          onNextTopic={() => handleNextTopic(activeTopicId)}
          onPrevTopic={() => handlePrevTopic(activeTopicId)}
          onCompleteTopic={() => handleCompleteTopic(activeTopicId)}
          onSlideChange={(topicId, slideIndex) => setLastSeen({ topicId, slideIndex })}
        />
      )}
      <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
        {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-red-600 p-1.5 sm:p-2 rounded-lg shadow-sm shrink-0">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-semibold text-sm sm:text-lg tracking-tight leading-tight">Curso de Introducción a LibGDX</h1>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] sm:text-sm leading-none">por</span>
                <div className="h-5 sm:h-8 flex items-center justify-center overflow-hidden" title="Logo UCAB">
                  <a href="https://www.ucab.edu.ve/" target="_blank" rel="noopener noreferrer" className="h-full flex items-center">
                    <img src="/assets/ucab_wide.webp" alt="UCAB" className="h-full w-auto object-contain" referrerPolicy="no-referrer" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm font-medium text-slate-500">
              Progreso
            </div>
            <div className="w-16 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-red-600 w-7 sm:w-9 text-right">{progress}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Plan de Estudio</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleStartContinue}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              {lastSeen ? 'Continuar Curso' : 'Iniciar Curso'}
            </button>
            <a 
              href="https://github.com/alfosua/pokemongdx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Soluciones</span>
              <span className="sm:hidden">GitHub</span>
            </a>
            <button 
              onClick={handleResetProgress}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors shadow-sm"
              title="Reiniciar progreso"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Spreadsheet Header */}
          <div className="hidden md:grid grid-cols-[auto_1fr_2fr_140px_80px] gap-4 p-4 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="w-10 text-center">#</div>
            <div>Tema</div>
            <div>Descripción</div>
            <div>Progreso</div>
            <div className="text-center"></div>
          </div>

          {/* Spreadsheet Body */}
          <div className="divide-y divide-slate-100">
            {data.map((item, index) => {
              const isNewModule = index === 0 || data[index - 1].module !== item.module;
              
              return (
                <React.Fragment key={item.id}>
                  {isNewModule && (
                    <div className="bg-slate-50/80 px-4 py-3 border-y border-slate-200/60 first:border-t-0">
                      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-red-500" />
                        {item.module}
                      </h3>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_2fr_140px_80px] gap-3 md:gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors group">
                    <div className="hidden md:block w-10 text-center text-sm font-mono text-slate-400">
                      {item.id.toString().padStart(2, '0')}
                    </div>
                    
                    <div>
                      <div className="font-medium text-slate-900">{item.topic}</div>
                    </div>
                    
                    <div className="text-sm text-slate-500 md:truncate pr-4" title={item.description}>
                      {item.description}
                    </div>
                    
                    <div className="flex items-center justify-between md:block mt-2 md:mt-0">
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        title="Haz clic en el estado para actualizar tu progreso."
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${getStatusBadgeClass(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </button>
                      
                      {/* Mobile link button */}
                      <button 
                        onClick={() => navigateToTopic(item.id, null, false)}
                        className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Ver presentación"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="hidden md:block text-center">
                      <button 
                        onClick={() => navigateToTopic(item.id, null, false)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Ver presentación"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 overflow-hidden shrink-0">
              <a href="https://www.ucab.edu.ve/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/ucab_square.webp" alt="UCAB Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </a>
            </div>
            <div>
              <a href="https://www.ucab.edu.ve/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                <p className="font-semibold text-slate-900">Universidad Católica Andrés Bello</p>
              </a>
              <p className="text-sm text-slate-500">Escuela de Ingeniería Informática - Sede Guayana</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-500">Tutor</p>
            <a href="https://github.com/alfosua" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-900 hover:text-red-600 transition-colors">Alfonso Suarez</a>
          </div>
        </div>
      </footer>
    </div>
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">¿Reiniciar progreso?</h3>
            <p className="text-slate-600 mb-6 text-sm">Esta acción borrará todo tu progreso actual y no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)} 
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmReset} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Completed Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Curso Completado!</h2>
            <p className="text-slate-600 mb-8">Has finalizado con éxito el Curso de Introducción a LibGDX.</p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 overflow-hidden shrink-0">
                  <a href="https://www.ucab.edu.ve/" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/ucab_square.webp" alt="UCAB Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </a>
                </div>
                <div>
                  <a href="https://www.ucab.edu.ve/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <p className="font-semibold text-slate-900">Universidad Católica Andrés Bello</p>
                  </a>
                  <p className="text-xs text-slate-500">Escuela de Ingeniería Informática - Sede Guayana</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4 mt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tutor</p>
                <a href="https://github.com/alfosua" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-900 hover:text-red-600 transition-colors">Alfonso Suarez</a>
              </div>
            </div>

            <button 
              onClick={() => setShowCreditsModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Chapter Transition Overlay */}
      {pendingTransition && (
        <div 
          className="fixed inset-0 z-[60] bg-red-600 flex flex-col items-center justify-center p-4 cursor-pointer animate-in fade-in duration-300"
          onClick={skipTransition}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight animate-in slide-in-from-bottom-4 duration-500 mb-8">
            {pendingTransition.module}
          </h2>
          <div className="w-64 h-1.5 bg-red-800 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-[shrink_4s_linear_forwards]" style={{ width: '100%', transformOrigin: 'left', animation: 'shrinkBar 4s linear forwards' }} />
          </div>
          <p className="text-red-300 text-sm mt-4">Haz clic para omitir</p>
          <style>{`
            @keyframes shrinkBar {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
