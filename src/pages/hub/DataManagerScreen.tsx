import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Database, Download, Upload, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function DataManagerScreen() {
  const navigate = useNavigate();
  const { exportAllData, importAllData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setShowExport] = useState(false);
  const [, setExportData] = useState('');
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importFile, setImportFile] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState('');

  const handleExport = () => {
    const data = exportAllData();
    setExportData(data);
    setShowExport(true);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hear-me-out-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Data exported successfully');
    setTimeout(() => setToast(''), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportFile(ev.target?.result as string);
      setShowImportConfirm(true);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const success = importAllData(importFile);
    setShowImportConfirm(false);
    setImportFile('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setToast(success ? 'Data imported successfully' : 'Import failed - invalid file');
    setTimeout(() => setToast(''), 3000);
  };

  const handleDeleteAll = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('hmo_') || k.startsWith('hearmeout_'));
    keys.forEach(k => localStorage.removeItem(k));
    setShowDeleteConfirm(false);
    setToast('All data cleared. Refresh to reset.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Data Manager</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database size={20} className="text-primary" />
            <p className="text-body-sm font-medium text-white">Your Data</p>
          </div>
          <p className="text-caption text-white/60">All your data is stored locally in your browser. Export regularly to keep backups.</p>
        </motion.div>

        {/* Export */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center">
              <Download size={22} className="text-sage" />
            </div>
            <div className="flex-1">
              <p className="text-body font-medium text-charcoal dark:text-cream-soft">Export Data</p>
              <p className="text-caption text-clay">Download all your data as JSON</p>
            </div>
            <ChevronLeft size={18} className="text-clay/40 rotate-180" />
          </div>
        </motion.button>

        {/* Import */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-body font-medium text-charcoal dark:text-cream-soft">Import Data</p>
              <p className="text-caption text-clay">Restore from a previous export</p>
            </div>
            <ChevronLeft size={18} className="text-clay/40 rotate-180" />
          </div>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
        </motion.button>

        {/* Delete */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full text-left bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-body font-medium text-red-600 dark:text-red-400">Delete All Data</p>
              <p className="text-caption text-red-400/70">Permanently remove everything</p>
            </div>
          </div>
        </motion.button>

        {/* Import confirm modal */}
        <AnimatePresence>
          {showImportConfirm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowImportConfirm(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[320px] bg-parchment dark:bg-espresso-deep rounded-2xl p-8">
                <AlertTriangle size={32} className="text-amber-500 mx-auto mb-4" />
                <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-2 text-center">Confirm Import</h3>
                <p className="text-body-sm text-clay text-center mb-6">This will overwrite your current data. Are you sure?</p>
                <div className="space-y-3">
                  <button onClick={handleImport} className="w-full h-[48px] rounded-full bg-primary text-white font-medium text-body">Import Data</button>
                  <button onClick={() => setShowImportConfirm(false)} className="w-full h-[48px] rounded-full border border-clay/30 text-clay text-body-sm">Cancel</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete confirm modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[320px] bg-parchment dark:bg-espresso-deep rounded-2xl p-8">
                <Trash2 size={32} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-2 text-center">Delete Everything?</h3>
                <p className="text-body-sm text-clay text-center mb-6">This permanently deletes all your data and cannot be undone.</p>
                <div className="space-y-3">
                  <button onClick={handleDeleteAll} className="w-full h-[48px] rounded-full bg-red-500 text-white font-medium text-body">Delete All Data</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="w-full h-[48px] rounded-full border border-clay/30 text-clay text-body-sm">Cancel</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <CheckCircle2 size={16} className="text-sage" />
              <span className="text-body-sm">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
