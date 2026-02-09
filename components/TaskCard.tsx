import React from 'react';
import { Task } from '../types.ts';
import { Trash2, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group relative bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 animate-in fade-in zoom-in-95"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 items-start">
            <span className="text-slate-400 mt-1">
                <GripVertical size={14} />
            </span>
            <p className="text-sm text-slate-700 leading-snug font-medium break-words">
            {task.content}
            </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
          aria-label="Eliminar tarea"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};