
import React from 'react';
import { DailyTask } from '../types';
import { X, Edit3, Trash2, Clock, Calendar, Tag, CheckCircle2, Circle } from 'lucide-react';

interface TaskDetailProps {
  task: DailyTask;
  onClose: () => void;
  onEdit: (task: DailyTask) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onEdit, onDelete, onToggle }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Image or Status */}
        <div className="relative h-48 bg-slate-800 flex items-center justify-center overflow-hidden">
          {task.proofImage ? (
            <img src={task.proofImage} alt="Proof" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-700 flex flex-col items-center gap-2">
              <CheckCircle2 size={64} className={task.status === 'Done' ? 'text-emerald-500' : 'text-slate-700'} />
              <span className="font-bold text-sm tracking-widest uppercase">Pekerjaan {task.status}</span>
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                {task.category}
              </span>
              <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
                <div className="flex items-center gap-1"><Calendar size={12} /> {task.date}</div>
                <div className="flex items-center gap-1"><Clock size={12} /> {task.time}</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">{task.title}</h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Catatan Pekerjaan</h3>
            <div 
              className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: task.notes || '<p class="text-slate-500 italic">Tidak ada catatan.</p>' }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
             <button 
              onClick={() => onToggle(task.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                task.status === 'Done' 
                ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              {task.status === 'Done' ? 'Sudah Selesai' : 'Tandai Selesai'}
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(task)}
                className="p-3 bg-purple-600 rounded-2xl text-white hover:bg-purple-500 transition-all cyber-glow"
              >
                <Edit3 size={20} />
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="p-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
