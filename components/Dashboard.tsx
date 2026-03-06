
import React from 'react';
import { Layout, FileText, ChevronRight, Zap, Target, Box, Cpu, Share2, BarChart3 } from 'lucide-react';
import ManagerAvatar from './ManagerAvatar';

interface DashboardProps {
  onNavigate: (view: 'timeline' | 'report' | 'socmed') => void;
  taskCount: number;
  avatar: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, taskCount, avatar }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -z-10" />
        
        <div className="relative group">
          <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-purple-600 to-fuchsia-600 cyber-glow group-hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-slate-900 shadow-2xl">
              {avatar ? (
                <img src={avatar} alt="Manager" className="w-full h-full object-cover" />
              ) : (
                <ManagerAvatar className="w-36 h-36" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-600 p-3 rounded-2xl shadow-2xl border border-purple-400/50">
            <Cpu size={22} className="text-white animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-5xl font-black text-white tracking-tighter">
            ACENG <span className="text-purple-500">DIGITAL</span>
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.5em] mt-2">Central Operation Command v2.6</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => onNavigate('timeline')}
          className="group relative overflow-hidden bg-slate-900 border border-purple-500/20 p-10 rounded-[3rem] flex items-center justify-between hover:border-purple-500 transition-all duration-300 md:col-span-2 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-purple-600/10 rounded-[1.8rem] border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Box size={40} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-2xl text-white">Daily Timeline Log</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase mt-1.5 tracking-widest">{taskCount} ACTIVE OPERATIONS TODAY</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
            <ChevronRight size={28} />
          </div>
        </button>

        <button 
          onClick={() => onNavigate('socmed')}
          className="group relative overflow-hidden bg-slate-900 border border-emerald-500/20 p-10 rounded-[3rem] flex items-center justify-between hover:border-emerald-500 transition-all duration-300 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-emerald-600/10 rounded-[1.8rem] border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Share2 size={40} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-2xl text-white">Socmed Commander</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase mt-1.5 tracking-widest">ADVANCED ANALYTICS & AI</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
            <ChevronRight size={28} />
          </div>
        </button>

        <button 
          onClick={() => onNavigate('report')}
          className="group relative overflow-hidden bg-slate-900 border border-fuchsia-500/20 p-10 rounded-[3rem] flex items-center justify-between hover:border-fuchsia-500 transition-all duration-300 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-fuchsia-600/10 rounded-[1.8rem] border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 group-hover:scale-110 transition-transform">
              <BarChart3 size={40} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-2xl text-white">Archive Bureau</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase mt-1.5 tracking-widest">HISTORICAL PDF EXPORTS</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-fuchsia-500/20 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-lg">
            <ChevronRight size={28} />
          </div>
        </button>
      </div>
      
      {/* Footer Info */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 border border-slate-800 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">SYSTEM PROTOCOL V2.6 // CLOUD ENCRYPTED ACTIVE</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
