
import React, { useState, useMemo } from 'react';
import { DailyTask } from '../types';
import { CheckCircle2, Circle, Clock, Tag, FileImage, LayoutList } from 'lucide-react';
import TaskDetail from './TaskDetail';

interface TimelineProps {
  tasks: DailyTask[];
  onEdit: (task: DailyTask) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks = [], onEdit, onDelete, onToggle }) => {
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);

  // Grouping data dengan useMemo dan safety check
  const groupedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return {};
    
    return tasks.reduce((groups: { [key: string]: DailyTask[] }, task) => {
      if (!task) return groups;
      const date = task.date || 'No Date';
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
      return groups;
    }, {});
  }, [tasks]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));
  }, [groupedTasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-600 space-y-4 animate-in fade-in duration-700">
        <LayoutList size={64} className="opacity-10" />
        <p className="font-medium">Belum ada aktivitas di timeline.</p>
        <p className="text-xs text-slate-500">Klik tombol + di pojok kanan bawah.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {sortedDates.map((date) => {
        const dayTasks = groupedTasks[date] || [];
        if (dayTasks.length === 0) return null;

        return (
          <div key={date} className="relative">
            {/* Sticky Date Header */}
            <div className="sticky top-[64px] z-30 py-4 bg-slate-950/95 backdrop-blur-md -mx-6 px-6 border-b border-purple-500/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em]">
                  {date !== 'No Date' ? new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : date}
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full border border-slate-800 font-bold">
                  {dayTasks.length} TUGAS
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              {dayTasks.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    task.status === 'Done' 
                    ? 'bg-slate-900/40 border-slate-900 opacity-60' 
                    : 'bg-slate-900 border-purple-500/10 hover:border-purple-500/40 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-800/50 pr-4">
                    <span className="text-xs font-black text-slate-400 group-hover:text-purple-400 transition-colors">{task.time}</span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${task.status === 'Done' ? 'bg-emerald-500' : 'bg-purple-500 animate-pulse'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase text-purple-500 bg-purple-500/10 px-1.5 rounded tracking-tighter border border-purple-500/20">
                        {task.category}
                      </span>
                      {task.proofImage && <FileImage size={10} className="text-purple-400 opacity-70" />}
                    </div>
                    <h4 className={`text-sm font-bold truncate ${task.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </h4>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50"
                  >
                    {task.status === 'Done' ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onEdit={(t) => { setSelectedTask(null); onEdit(t); }}
          onDelete={(id) => { setSelectedTask(null); onDelete(id); }}
          onToggle={onToggle}
        />
      )}
    </div>
  );
};

export default Timeline;
