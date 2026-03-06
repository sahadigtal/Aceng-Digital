
import React, { useState, useMemo, useEffect } from 'react';
import { SocialMediaData, Metric } from '../types';
import { Instagram, Facebook, Globe, MessageSquare, Download, Sparkles, Plus, Trash2, Calendar, FileText, Presentation, Target, Cloud, History, BarChart3, ChevronRight, Search, Terminal, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', 
    defaults: ['Followers', 'Reach', 'Engagement Rate', 'Profile Visits', 'Story Views'] },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', 
    defaults: ['Page Likes', 'Post Reach', 'Link Clicks', 'Engagement', 'Messages'] },
  { name: 'TikTok', icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', 
    defaults: ['Followers', 'Video Views', 'Profile Views', 'Likes', 'Comments'] },
  { name: 'Web', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', 
    defaults: ['Sessions', 'Users', 'Bounce Rate', 'Avg. Duration', 'Conversions'] }
];

interface Props {
  reports: SocialMediaData[];
  onSave: (report: SocialMediaData) => void;
}

const SocialMediaReport: React.FC<Props> = ({ reports = [], onSave }) => {
  const [viewMode, setViewMode] = useState<'form' | 'history'>('form');
  const [activePlatform, setActivePlatform] = useState<any>(platforms[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [customContext, setCustomContext] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Filtering states for History
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [filterPlatform, setFilterPlatform] = useState<string>('All');

  useEffect(() => {
    if (viewMode === 'form') {
      const initialMetrics = activePlatform.defaults.map((label: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        label,
        value: '0'
      }));
      setMetrics(initialMetrics);
      setAiAnalysis('');
      setAiRecs([]);
      setCustomContext('');
    }
  }, [activePlatform, viewMode]);

  const filteredHistory = useMemo(() => {
    return reports.filter(r => {
      const monthMatch = r.date.startsWith(filterMonth);
      const platformMatch = filterPlatform === 'All' || r.platform === filterPlatform;
      return monthMatch && platformMatch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [reports, filterMonth, filterPlatform]);

  const handleUpdateMetric = (id: string, value: string) => {
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, value } : m));
  };

  const handleAddMetric = () => {
    setMetrics(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), label: 'New Metric', value: '0' }]);
  };

  const handleRemoveMetric = (id: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateLabel = (id: string, label: string) => {
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, label } : m));
  };

  const generateAIInsight = async () => {
    if (metrics.length === 0) return;
    setIsAnalysing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statsStr = metrics.map(m => `${m.label}: ${m.value}`).join(', ');
      
      const prompt = `Analyze these ${activePlatform.name} statistics for a professional digital marketing report: ${statsStr}. 
      ${customContext ? `IMPORTANT ADDITIONAL CONTEXT/INSTRUCTION: ${customContext}` : ''}
      Return a response in strict JSON format with two keys: "analysis" (a 2-3 sentence overview focused on the data and provided context) and "recommendations" (an array of 3 short, actionable marketing tips derived from the statistics and objectives).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const resultText = response.text || "{}";
      const data = JSON.parse(resultText);
      setAiAnalysis(data.analysis || "");
      setAiRecs(data.recommendations || []);
    } catch (e) {
      console.error("AI Analysis failed", e);
      setAiAnalysis("Analisa data tidak dapat ditarik. Pastikan metrik sudah terisi dengan benar.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSaveReport = () => {
    const report: SocialMediaData = {
      id: Math.random().toString(36).substr(2, 9),
      platform: activePlatform.name,
      date,
      metrics,
      customContext,
      analysis: aiAnalysis,
      recommendations: aiRecs,
      createdAt: Date.now()
    };
    onSave(report);
    alert('Laporan berhasil disimpan ke Database Cloud!');
  };

  const loadReport = (report: SocialMediaData) => {
    const platform = platforms.find(p => p.name === report.platform) || platforms[0];
    setActivePlatform(platform);
    setDate(report.date);
    setMetrics(report.metrics);
    setCustomContext(report.customContext || '');
    setAiAnalysis(report.analysis || '');
    setAiRecs(report.recommendations || []);
    setViewMode('form');
  };

  const exportPDF = () => {
    const element = document.getElementById('socmed-printable');
    if (!element) return;
    setIsGenerating(true);
    // @ts-ignore
    const opt = {
      margin: 10,
      filename: `Socmed_Report_${activePlatform.name}_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false));
  };

  const exportPPT = () => {
    // @ts-ignore
    let pptx = new PptxGenJS();
    let slide = pptx.addSlide();
    
    slide.addText(`SOCIAL MEDIA REPORT: ${activePlatform.name.toUpperCase()}`, { x: 0.5, y: 0.5, fontSize: 24, color: 'A855F7', bold: true });
    slide.addText(`Periode: ${date}`, { x: 0.5, y: 1.0, fontSize: 12, color: '64748B' });

    let rows = metrics.map(m => [m.label, m.value]);
    slide.addTable([['Metric', 'Performance'], ...rows], { x: 0.5, y: 1.5, w: 9, rowH: 0.4, fill: { color: 'F8FAFC' }, border: { pt: 1, color: 'E2E8F0' } });

    let slide2 = pptx.addSlide();
    slide2.addText(`ANALYSIS & RECOMMENDATIONS`, { x: 0.5, y: 0.5, fontSize: 20, color: 'A855F7', bold: true });
    slide2.addText(aiAnalysis || "No analysis provided.", { x: 0.5, y: 1.2, w: 9, fontSize: 14, color: '334155' });
    
    aiRecs.forEach((rec, i) => {
      slide2.addText(`• ${rec}`, { x: 0.7, y: 4.2 + (i * 0.5), w: 8.5, fontSize: 12, color: '475569' });
    });

    pptx.writeFile({ fileName: `Socmed_Report_${activePlatform.name}_${date}.pptx` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Controls */}
      <div className="flex justify-between items-center no-print">
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button 
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'form' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Plus size={16} /> Data Input
          </button>
          <button 
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'history' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <History size={16} /> Database Log
          </button>
        </div>
      </div>

      {viewMode === 'form' ? (
        <>
          {/* Platform Selector */}
          <div className="flex flex-wrap gap-3 no-print">
            {platforms.map(p => (
              <button
                key={p.name}
                onClick={() => setActivePlatform(p)}
                className={`flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all ${activePlatform.name === p.name ? `${p.bg} ${p.border} ${p.color} ring-2 ring-purple-500/20 shadow-lg` : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
              >
                <p.icon size={20} />
                <span className="font-black text-sm uppercase tracking-widest">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-6 no-print flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${activePlatform.bg}`}>
                    <activePlatform.icon className={activePlatform.color} size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{activePlatform.name} Entry</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Performance Intelligence</p>
                  </div>
                </div>
                <input 
                  type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              {/* Metrics Column */}
              <div className="space-y-3 custom-scrollbar max-h-[350px] pr-2 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2 ml-1 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <BarChart3 size={12} /> Live Metrics Data
                </div>
                {metrics.map(metric => (
                  <div key={metric.id} className="flex items-center gap-3 group animate-in slide-in-from-right-4 duration-300">
                    <input 
                      type="text" value={metric.label} onChange={e => handleUpdateLabel(metric.id, e.target.value)}
                      placeholder="Label metrik..."
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all font-bold"
                    />
                    <input 
                      type="text" value={metric.value} onChange={e => handleUpdateMetric(metric.id, e.target.value)}
                      placeholder="0"
                      className="w-28 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white font-black text-center focus:outline-none focus:border-purple-500 transition-all shadow-lg"
                    />
                    <button onClick={() => handleRemoveMetric(metric.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={handleAddMetric} className="w-full py-3 bg-slate-800/30 hover:bg-slate-800 text-slate-500 rounded-2xl border border-slate-700/50 border-dashed flex items-center justify-center gap-2 transition-all group mt-2">
                  <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Custom Metric Field</span>
                </button>
              </div>

              {/* Strategic Command Input (PROMPT) */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 ml-1 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
                  <Terminal size={12} /> Strategic Command Input
                </div>
                <textarea 
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Tambahkan perintah atau konteks khusus (Contoh: 'Fokus pada peningkatan engagement dari Gen-Z' atau 'Bandingkan dengan performa bulan lalu')..."
                  className="w-full h-24 bg-slate-950 border border-purple-500/20 rounded-2xl px-4 py-4 text-xs text-slate-300 focus:outline-none focus:border-purple-500 transition-all resize-none custom-scrollbar leading-relaxed"
                />
                <div className="flex items-center gap-1.5 ml-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest italic">
                  <Info size={10} /> Konteks ini akan diproses oleh AI untuk analisa yang lebih akurat
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-auto">
                <button 
                  onClick={generateAIInsight}
                  disabled={isAnalysing || metrics.length === 0}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl flex items-center justify-center gap-3 transition-all cyber-glow group disabled:opacity-50"
                >
                  {isAnalysing ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={20} className="group-hover:animate-pulse" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">Run Strategic AI Analysis</span>
                </button>
              </div>
            </div>

            {/* Live Preview / Report Section */}
            <div id="socmed-printable" className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-2xl min-h-[700px] flex flex-col border-4 border-slate-100 relative overflow-hidden print:m-0 print:border-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-2xl ${activePlatform.bg}`}>
                       <activePlatform.icon className={activePlatform.color} size={28} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activePlatform.name} <span className="text-purple-600">INSIGHT</span></h1>
                  </div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-2">
                    <Calendar size={14} /> {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Generated by Aceng Digital</div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 justify-end border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Data Verified
                  </div>
                </div>
              </div>

              {/* Data Grid with Visuals */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {metrics.map(m => {
                  const valNum = parseInt(m.value.replace(/[^0-9]/g, '')) || 0;
                  const progress = Math.min(100, (valNum / 1000) * 100); 
                  return (
                    <div key={m.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
                      <div className="flex justify-between items-end mb-4 relative z-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                          <p className="text-3xl font-black text-slate-900 tracking-tighter">{m.value}</p>
                        </div>
                        <BarChart3 size={24} className="text-slate-200" />
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden relative z-10">
                        <div className="h-full bg-purple-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-10 flex-1 relative z-10">
                {customContext && (
                  <div className="space-y-2 opacity-60">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Terminal size={12} /> Strategic Instructions
                    </h3>
                    <p className="text-[10px] text-slate-500 italic font-bold">"{customContext}"</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-purple-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={16} /> Automated AI Analysis
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border-l-4 border-purple-600">
                    <p className="text-sm text-slate-700 leading-relaxed font-bold italic prose prose-slate max-w-none">
                      {aiAnalysis || "Lengkapi metrik dan masukan perintah strategi, lalu klik 'Run Strategic AI Analysis' untuk mendapatkan insight otomatis."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target size={16} /> Marketing Recommendations
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {aiRecs.length > 0 ? aiRecs.map((rec, i) => (
                      <div key={i} className="flex gap-5 items-start bg-emerald-50/40 p-5 rounded-[1.5rem] border border-emerald-100 group">
                        <span className="w-8 h-8 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">{i+1}</span>
                        <p className="text-xs text-slate-800 font-bold leading-relaxed pt-1.5">{rec}</p>
                      </div>
                    )) : (
                      <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-black text-[10px] uppercase tracking-widest">
                        Rekomendasi strategi akan muncul setelah analisa AI
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-200 rounded-full" />
                  Aceng Digital Operation Bureau
                </div>
                <span>Auth: System Admin // ID-{Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="fixed bottom-0 left-0 w-full p-6 bg-slate-950/90 backdrop-blur-md border-t border-purple-500/20 flex items-center justify-center gap-4 no-print z-50">
            <button 
              onClick={handleSaveReport}
              className="px-8 py-4 bg-slate-900 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-800 hover:border-purple-500 transition-all flex items-center gap-3 active:scale-95"
            >
              <Cloud size={18} /> Update Cloud DB
            </button>
            <button 
              onClick={exportPDF}
              disabled={isGenerating}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3 transition-all cyber-glow active:scale-95"
            >
              <FileText size={18} /> Download PDF
            </button>
            <button 
              onClick={exportPPT}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Presentation size={18} /> Save to PPTX
            </button>
          </div>
        </>
      ) : (
        /* History / Log Mode */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-500">
                <History size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Insight Database Log</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Historical Performance Tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 px-3 text-slate-500">
                <Search size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
              </div>
              <select 
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="bg-slate-900 border-none text-xs font-black uppercase tracking-widest text-slate-300 rounded-xl px-4 py-2 focus:ring-1 focus:ring-purple-500"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - i);
                  const val = d.toISOString().substring(0, 7);
                  return <option key={val} value={val}>{d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</option>
                })}
              </select>
              <select 
                value={filterPlatform}
                onChange={e => setFilterPlatform(e.target.value)}
                className="bg-slate-900 border-none text-xs font-black uppercase tracking-widest text-slate-300 rounded-xl px-4 py-2 focus:ring-1 focus:ring-purple-500"
              >
                <option value="All">All Platforms</option>
                {platforms.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.length > 0 ? filteredHistory.map(report => {
              const platform = platforms.find(p => p.name === report.platform) || platforms[0];
              return (
                <div 
                  key={report.id} 
                  onClick={() => loadReport(report)}
                  className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-3xl ${platform.bg}`}>
                      <platform.icon className={platform.color} size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-lg tracking-tight">{report.platform} Report</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{report.metrics.length} Metrik Terinput</p>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${report.analysis ? 'text-emerald-500' : 'text-slate-700'}`}>
                        {report.analysis ? 'Analisa Tersedia' : 'Pending Analisa'}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4 text-slate-600 opacity-30">
                <History size={64} />
                <p className="font-black text-xs uppercase tracking-[0.4em]">Data tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaReport;
