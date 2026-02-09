import React, { useState } from 'react';
import { DayOfWeek } from '../types.ts';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateTasksWithAI } from '../services/geminiService.ts';

interface NewTaskModalProps {
  isOpen: boolean;
  initialDay: DayOfWeek;
  onClose: () => void;
  onSave: (content: string, day: DayOfWeek) => void;
  onAiTasksGenerated: (tasks: any[]) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  initialDay,
  onClose,
  onSave,
  onAiTasksGenerated
}) => {
  const [content, setContent] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay);
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setSelectedDay(initialDay);
      setContent('');
      setAiPrompt('');
      setMode('manual');
    }
  }, [isOpen, initialDay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content, selectedDay);
      onClose();
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const tasks = await generateTasksWithAI(aiPrompt);
      onAiTasksGenerated(tasks);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error generating tasks. Please check your API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-4 text-sm font-medium">
             <button 
                onClick={() => setMode('manual')}
                className={`pb-1 border-b-2 transition-colors ${mode === 'manual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
             >
                Manual
             </button>
             <button 
                onClick={() => setMode('ai')}
                className={`flex items-center gap-1 pb-1 border-b-2 transition-colors ${mode === 'ai' ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
             >
                <Sparkles size={14} />
                AI Magic
             </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'manual' ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Día</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  {Object.values(DayOfWeek).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarea</label>
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ej: Revisar correos..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-sm"
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ¿Qué quieres lograr esta semana?
                    </label>
                    <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ej: Planificar el lanzamiento del nuevo producto web..."
                        className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none h-24 text-sm text-slate-800 placeholder-purple-300"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        La IA generará tareas y las distribuirá en tu semana.
                    </p>
                </div>
                <div className="flex justify-end gap-2 mt-auto">
                    <button
                        onClick={handleAiGenerate}
                        disabled={!aiPrompt.trim() || isGenerating}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Pensando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Generar Plan
                            </>
                        )}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};