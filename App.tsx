import React, { useState, useEffect } from 'react';
import { Column } from './components/Column';
import { NewTaskModal } from './components/NewTaskModal';
import { DayOfWeek, Task, DAYS } from './types';
import { Layout, CalendarDays, Plus } from 'lucide-react';

// Sample initial data if needed, or empty
const INITIAL_TASKS: Task[] = [];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load from local storage
    const saved = localStorage.getItem('kanban-tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDayForModal, setActiveDayForModal] = useState<DayOfWeek>(DayOfWeek.Lunes);

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskDrop = (taskId: string, targetDay: DayOfWeek) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, day: targetDay } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleAddTask = (day: DayOfWeek) => {
    setActiveDayForModal(day);
    setIsModalOpen(true);
  };

  const saveNewTask = (content: string, day: DayOfWeek) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      day,
      createdAt: Date.now(),
      color: 'bg-white'
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleAiTasksGenerated = (newTasks: Task[]) => {
      setTasks(prev => [...prev, ...newTasks]);
  };

  const handleGlobalAdd = () => {
      setActiveDayForModal(DayOfWeek.Lunes); // Default to Monday
      setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
                <CalendarDays size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Semana<span className="text-blue-600">Kanban</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={handleGlobalAdd}
                className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
             >
                <Plus size={16} />
                Nueva Tarea
             </button>
             {/* Mobile Fab alternative is simpler: just use the column buttons */}
          </div>
        </div>
      </header>

      {/* Kanban Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full min-w-full p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 h-full min-w-[320px] md:min-w-[1200px] max-w-[1800px] mx-auto">
            {DAYS.map((day) => (
                <Column
                    key={day}
                    day={day}
                    tasks={tasks.filter((t) => t.day === day)}
                    onTaskDrop={handleTaskDrop}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={handleAddTask}
                />
            ))}
            </div>
        </div>
      </main>

      <NewTaskModal
        isOpen={isModalOpen}
        initialDay={activeDayForModal}
        onClose={() => setIsModalOpen(false)}
        onSave={saveNewTask}
        onAiTasksGenerated={handleAiTasksGenerated}
      />
      
      {/* Mobile Footer/Hint */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur border-t p-2 text-center text-xs text-slate-500">
          Desliza horizontalmente para ver todos los días
      </div>
    </div>
  );
}

export default App;