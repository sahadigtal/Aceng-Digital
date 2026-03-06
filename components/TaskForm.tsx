
import React, { useState, useEffect, useRef } from 'react';
import { DailyTask } from '../types';
import { X, Save, Trash2, Camera, Bold, Italic, AlignLeft, AlignCenter } from 'lucide-react';

interface TaskFormProps {
  task: DailyTask | null;
  onSave: (task: DailyTask) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState<DailyTask>({
    id: '',
    title: '',
    time: new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    category: 'Work',
    notes: '',
    status: 'Pending',
    createdAt: Date.now(),
  });
  
  const notesRef = useRef<HTMLDivElement>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        notes: task.notes || '',
      });
      if (!['Work', 'Personal', 'Meeting', 'Marketing'].includes(task.category)) {
        setIsCustomCategory(true);
        setCustomCategory(task.category);
      }
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    // Ambil konten HTML terbaru dari ref
    const currentNotes = notesRef.current?.innerHTML || formData.notes || '';
    const finalCategory = isCustomCategory ? customCategory : formData.category;
    
    try {
      onSave({
        ...formData,
        id: formData.id || Math.random().toString(36).substring(2, 11),
        category: finalCategory || 'Work',
        notes: currentNotes,
        createdAt: formData.createdAt || Date.now(),
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, proofImage: reader.result as string }));
      };
      reader.onerror = () => console.error("FileReader error");
      reader.readAsDataURL(file);
    }
  };

  const applyFormatting = (e: React.MouseEvent, format: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    try {
      document.execCommand(format, false);
    } catch (err) {
      console.warn("Formatting not supported", err);
    }
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: 'Pending' | 'Done') => {
    e.preventDefault();
    setFormData(p => ({ ...p, status: newStatus }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        <div className="p-5 border-b border-purple-500/10 flex justify-between items-center bg-slate-950/50">
          <h2 className="text-lg font-black text-white tracking-tight uppercase">
            {task ? 'Update Entry' : 'Create Entry'}
          </h2>
          <button onClick={onClose} type="button" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Status Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={(e) => handleStatusChange(e, 'Pending')}
              className={`py-3.5 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'Pending' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
            >
              Pending
            </button>
            <button 
              type="button"
              onClick={(e) => handleStatusChange(e, 'Done')}
              className={`py-3.5 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'Done' ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
            >
              Selesai
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tanggal</label>
              <input 
                type="date" required 
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Waktu</label>
              <input 
                type="time" required 
                value={formData.time}
                onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Judul Pekerjaan</label>
            <input 
              type="text" required placeholder="Apa yang kamu lakukan hari ini?"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
            <div className="flex gap-2 flex-wrap">
              {['Work', 'Personal', 'Meeting', 'Marketing'].map(c => (
                <button 
                  key={c} type="button"
                  onClick={() => { setIsCustomCategory(false); setFormData(p => ({ ...p, category: c })); }}
                  className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${formData.category === c && !isCustomCategory ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-md shadow-purple-500/5' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
              <button 
                type="button"
                onClick={() => setIsCustomCategory(true)}
                className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${isCustomCategory ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
              >
                Custom
              </button>
            </div>
            {isCustomCategory && (
              <input 
                type="text" placeholder="Masukkan kategori khusus..."
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="mt-3 w-full bg-slate-800 border border-purple-500/30 rounded-2xl px-4 py-3.5 text-sm text-white animate-in slide-in-from-top-2"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detail Catatan</label>
            <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800 focus-within:border-purple-500 transition-colors">
              <div className="flex gap-1 p-2 bg-slate-900/50 border-b border-slate-700">
                <button type="button" onMouseDown={(e) => applyFormatting(e, 'bold')} className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400"><Bold size={14} /></button>
                <button type="button" onMouseDown={(e) => applyFormatting(e, 'italic')} className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400"><Italic size={14} /></button>
                <div className="w-[1px] bg-slate-700 mx-1.5 my-1.5" />
                <button type="button" onMouseDown={(e) => applyFormatting(e, 'justifyLeft')} className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400"><AlignLeft size={14} /></button>
                <button type="button" onMouseDown={(e) => applyFormatting(e, 'justifyCenter')} className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400"><AlignCenter size={14} /></button>
              </div>
              <div 
                ref={notesRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="w-full min-h-[160px] max-h-[300px] overflow-y-auto px-5 py-4 text-sm text-slate-200 focus:outline-none custom-scrollbar leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formData.notes }}
              />
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lampiran Bukti Kerja</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-2xl p-7 flex flex-col items-center justify-center gap-2 text-slate-500 transition-all bg-slate-800/30">
                  <Camera size={26} className="text-purple-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ambil Gambar</span>
                </div>
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </label>
              {formData.proofImage && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-xl shadow-purple-500/10">
                  <img src={formData.proofImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-slate-900 pb-2">
            {task && (
              <button 
                type="button"
                onClick={() => onDelete(task.id)}
                className="p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-rose-500/5"
              >
                <Trash2 size={22} />
              </button>
            )}
            <button 
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl flex items-center justify-center gap-3 transition-all cyber-glow active:scale-95 shadow-xl shadow-purple-600/20"
            >
              <Save size={20} />
              {task ? 'Simpan Perubahan' : 'Publish Ke Timeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
