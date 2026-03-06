
import React, { useState, useMemo } from 'react';
import { DailyTask, ReportType } from '../types';
import { FileText, Download, Filter, BarChart2, Printer, CheckCircle, Circle } from 'lucide-react';

interface ReportViewProps {
  tasks: DailyTask[];
}

const ReportView: React.FC<ReportViewProps> = ({ tasks = [] }) => {
  const [reportType, setReportType] = useState<ReportType>('Full');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTasks = useMemo(() => {
    return (tasks || []).filter(t => t.date >= startDate && t.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [tasks, startDate, endDate]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const done = filteredTasks.filter(t => t.status === 'Done').length;
    const pending = total - done;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, completionRate };
  }, [filteredTasks]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-printable');
    if (!element) return;

    setIsGenerating(true);
    
    // Konfigurasi untuk html2pdf
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Report_Aceng_${startDate}_to_${endDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gunakan window.html2pdf jika sudah dimuat via script tag
    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
      }).catch((err: any) => {
        console.error("PDF Error:", err);
        setIsGenerating(false);
        alert("Gagal mengunduh PDF. Silakan coba lagi.");
      });
    } else {
      // Fallback ke window.print jika library gagal
      window.print();
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Configuration Box */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-purple-500/20 space-y-4 no-print shadow-xl">
        <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest text-xs mb-2">
          <Filter size={16} />
          <h2>Konfigurasi Laporan</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Dari Tanggal</label>
            <input 
              type="date" value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Sampai Tanggal</label>
            <input 
              type="date" value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setReportType('Full')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2 transition-all ${reportType === 'Full' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            <FileText size={18} />
            Full Detail
          </button>
          <button 
            onClick={() => setReportType('Summary')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2 transition-all ${reportType === 'Summary' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            <BarChart2 size={18} />
            Summary List
          </button>
        </div>

        <button 
          onClick={handleDownloadPDF}
          disabled={filteredTasks.length === 0 || isGenerating}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 transition-all cyber-glow relative overflow-hidden"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download PDF Report</span>
            </>
          )}
        </button>
      </div>

      {/* Actual Report Content */}
      <div className={`space-y-6 ${isGenerating ? 'opacity-30' : ''}`}>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-slate-600 no-print flex flex-col items-center gap-4">
            <FileText size={48} className="opacity-10" />
            <p className="font-medium text-sm">Tidak ada data untuk periode ini.</p>
          </div>
        ) : (
          <div id="report-printable" className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl print:shadow-none print:p-0">
            {/* Header Laporan */}
            <div className="border-b-4 border-purple-600 pb-8 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">ACENG WORK REPORT</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">Digital Management System v2.5</p>
                <div className="mt-6 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-slate-300">Dibuat</span>
                    <span className="text-slate-600">{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-300">Periode</span>
                    <span className="text-slate-600">{startDate} - {endDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-black text-purple-600 leading-none">{stats.completionRate}%</div>
                <div className="text-[10px] font-black uppercase text-purple-400 tracking-widest mt-1">Efficiency</div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Jobs</div>
                <div className="text-3xl font-black text-slate-900">{stats.total}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completed</div>
                <div className="text-3xl font-black text-emerald-700">{stats.done}</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pending</div>
                <div className="text-3xl font-black text-amber-700">{stats.pending}</div>
              </div>
            </div>

            {/* Report Content based on Type */}
            {reportType === 'Full' ? (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Detailed Productivity Log</h3>
                <div className="space-y-6">
                  {filteredTasks.map(t => (
                    <div key={t.id} className="flex gap-6 pb-6 border-b border-slate-100 last:border-0">
                      <div className="min-w-[80px] text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</div>
                        <div className="text-lg font-black text-purple-600">{t.time}</div>
                        <div className={`mt-2 text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${t.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {t.status}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase">{t.category}</span>
                          <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: t.notes || 'No description provided.' }} />
                      </div>
                      {t.proofImage && (
                        <div className="min-w-[64px]">
                          <img src={t.proofImage} alt="Bukti" className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shadow-md" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Activity Summary</h3>
                <div className="space-y-3">
                  {filteredTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${t.status === 'Done' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{t.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{t.date} @ {t.time}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-purple-600 bg-white px-2 py-1 rounded-lg border border-slate-100">{t.category}</span>
                    </div>
                  ))}
                </div>
                
                {/* Visual Productivity Simulation */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Output Visualization</div>
                  <div className="flex items-end justify-center gap-2 h-32 px-4">
                    {[30, 80, 40, 95, 60, 20, 75, 50, 90, 45].map((h, i) => (
                      <div key={i} className="flex-1 max-w-[24px] bg-slate-100 rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-purple-600 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-100 text-center">
              <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
                VERIFIED DIGITAL LOG // SECURE TRANSMISSION
              </div>
              <div className="mt-2 text-[8px] text-slate-200">
                Generated via Aceng Digital Manager Protocol v2.5.0
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;
