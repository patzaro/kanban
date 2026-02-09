import React from 'react';
import { DayOfWeek, Task, COLUMN_COLORS } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  day: DayOfWeek;
  tasks: Task[];
  onTaskDrop: (taskId: string, targetDay: DayOfWeek) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (day: DayOfWeek) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  day, 
  tasks, 
  onTaskDrop, 
  onDeleteTask,
  onAddTask
}) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, day);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className={`flex flex-col min-w-[280px] w-full md:w-1/5 h-full max-h-full rounded-xl transition-colors duration-300 ${
        isOver ? 'bg-slate-100 ring-2 ring-blue-400 ring-inset' : 'bg-slate-50/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className={`p-3 rounded-t-xl border-b flex justify-between items-center ${COLUMN_COLORS[day]}`}>
        <h2 className="font-bold text-sm uppercase tracking-wider">{day}</h2>
        <span className="text-xs font-semibold bg-white/50 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone / Task List */}
      <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={onDeleteTask}
            onDragStart={handleDragStart}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-lg text-sm">
            Sin tareas
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="p-2 border-t border-slate-100">
        <button
          onClick={() => onAddTask(day)}
          className="w-full flex items-center justify-center gap-2 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Añadir tarjeta
        </button>
      </div>
    </div>
  );
};