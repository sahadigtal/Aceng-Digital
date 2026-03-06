
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Cloud, User, PlusCircle } from 'lucide-react';
import { DailyTask, SocialMediaData } from './types';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import TaskForm from './components/TaskForm';
import ReportView from './components/ReportView';
import SocialMediaReport from './components/SocialMediaReport';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'timeline' | 'report' | 'socmed'>('home');
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [socialReports, setSocialReports] = useState<SocialMediaData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('aceng_tasks');
      const savedSocmed = localStorage.getItem('aceng_socmed');
      const savedAvatar = localStorage.getItem('aceng_avatar');
      
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
      if (savedSocmed) {
        const parsed = JSON.parse(savedSocmed);
        if (Array.isArray(parsed)) setSocialReports(parsed);
      }
      if (savedAvatar) setAvatar(savedAvatar);
    } catch (e) {
      console.error("Critical: Storage Load Failed", e);
    }
  }, []);

  useEffect(() => {
    const syncData = async () => {
      try {
        setIsSyncing(true);
        localStorage.setItem('aceng_tasks', JSON.stringify(tasks));
        localStorage.setItem('aceng_socmed', JSON.stringify(socialReports));
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSyncing(false);
      } catch (e) {
        console.error("Sync Failed", e);
        setIsSyncing(false);
      }
    };
    syncData();
  }, [tasks, socialReports]);

  const addTask = useCallback((task: DailyTask) => {
    setTasks(prev => [task, ...prev].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    setIsFormOpen(false);
  }, []);

  const updateTask = useCallback((updatedTask: DailyTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    setIsFormOpen(false);
  }, []);

  const deleteTask = useCallback((id: string) => {
    if (window.confirm('Hapus tugas?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      setEditingTask(null);
      setIsFormOpen(false);
    }
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Done' ? 'Pending' : 'Done' } : t
    ));
  }, []);

  const handleSaveSocmed = (report: SocialMediaData) => {
    setSocialReports(prev => {
      const exists = prev.find(r => r.id === report.id);
      if (exists) return prev.map(r => r.id === report.id ? report : r);
      return [report, ...prev];
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem('aceng_avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-500/10 px-6 h-16 flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          {view !== 'home' && (
            <button 
              onClick={() => setView('home')}
              className="p-2 hover:bg-slate-900 rounded-2xl text-purple-400 transition-all border border-transparent hover:border-purple-500/20"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <h1 className="text-lg font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent uppercase tracking-tighter">
            {view === 'home' ? 'Aceng Control' : view === 'socmed' ? 'Socmed Commander' : 'Work Timeline'}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            {isSyncing ? (
              <span className="text-purple-400 flex items-center gap-1.5 animate-pulse">
                <Cloud size={14} /> Syncing
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1.5 opacity-70">
                <Cloud size={14} /> Cloud Active
              </span>
            )}
          </div>
          <label className="cursor-pointer relative group">
            <div className="w-9 h-9 rounded-full border border-purple-500/30 overflow-hidden bg-slate-900 flex items-center justify-center hover:cyber-glow transition-all">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-purple-500" />
              )}
            </div>
            <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>
      </header>

      <main className="pt-24 pb-24 px-6 max-w-4xl mx-auto min-h-screen no-print">
        {view === 'home' && (
          <Dashboard onNavigate={setView} taskCount={tasks.length} avatar={avatar} />
        )}
        {view === 'timeline' && (
          <Timeline 
            tasks={tasks || []} 
            onEdit={(t) => { setEditingTask(t); setIsFormOpen(true); }}
            onDelete={deleteTask}
            onToggle={toggleTaskStatus}
          />
        )}
        {view === 'report' && (
          <ReportView tasks={tasks || []} />
        )}
        {view === 'socmed' && (
          <SocialMediaReport reports={socialReports} onSave={handleSaveSocmed} />
        )}
      </main>

      {view === 'timeline' && !isFormOpen && (
        <button 
          onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center cyber-glow hover:bg-purple-500 hover:-translate-y-1 transition-all z-40 no-print shadow-2xl"
        >
          <PlusCircle size={32} className="text-white" />
        </button>
      )}

      {isFormOpen && (
        <TaskForm 
          task={editingTask} 
          onSave={editingTask ? updateTask : addTask} 
          onClose={() => setIsFormOpen(false)}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default App;
