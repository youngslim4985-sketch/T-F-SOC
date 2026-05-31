import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, CheckCircle2, Search, Filter, MoreVertical, BrainCircuit, RefreshCw } from 'lucide-react';
import { mockThreats as fallbackThreats } from '../data';
import StatCard from './StatCard';
import { cn } from '@/src/lib/utils';
import { Threat } from '../types';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function SOCOverview() {
  const [threats, setThreats] = React.useState<Threat[]>([]);
  const [selectedThreat, setSelectedThreat] = React.useState<Threat | null>(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'threats'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Threat[];
      setThreats(threatList.length > 0 ? threatList : fallbackThreats);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'threats');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAIAnalyze = async (threat: Threat) => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatData: threat })
      });
      const aiResponse = await response.json();
      
      const analyzedThreat = { ...threat, ...aiResponse };
      setSelectedThreat(analyzedThreat);

      // If it's a Firestore document (has an id that isn't a mock one or we just check if it exists in DB)
      // For this demo, let's assume we can update if it's from Firestore
      if (threat.id && !threat.id.startsWith('mock-')) {
        await updateDoc(doc(db, 'threats', threat.id), aiResponse);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Incidents" 
          value={threats.filter(t => t.status !== 'resolved').length} 
          icon={AlertCircle} 
          trend={{ value: 12, isUp: true }}
          description="High severity pending review"
        />
        <StatCard 
          title="Threat Score" 
          value="64.2" 
          icon={ShieldAlert} 
          trend={{ value: 4, isUp: false }}
          description="System-wide aggregate risk"
        />
        <StatCard 
          title="Avg Triage Time" 
          value="4.2m" 
          icon={BrainCircuit} 
          description="AI vs Human response lag"
        />
        <StatCard 
          title="Resolved (24h)" 
          value={128} 
          icon={CheckCircle2} 
          trend={{ value: 8, isUp: true }}
          description="Auto-remediated by Sentinel"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Threat Feed */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Threat Feed</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Filter threats..." 
                  className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors w-64"
                />
              </div>
              <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-800/50 text-zinc-500 text-xs font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Threat Type</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {threats.map((threat) => (
                  <motion.tr 
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={cn(
                      "group cursor-pointer transition-colors hover:bg-zinc-800/30",
                      selectedThreat?.id === threat.id && "bg-indigo-600/5"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">{threat.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        threat.severity === 'critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        threat.severity === 'high' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          threat.status === 'active' ? "bg-red-500 animate-pulse" :
                          threat.status === 'investigating' ? "bg-yellow-500" :
                          "bg-green-500"
                        )} />
                        {threat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 font-mono">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {threat.source}
                    </td>
                    <td className="px-6 py-4 text-right transform group-hover:translate-x-1 transition-transform">
                      <MoreVertical className="w-4 h-4 text-zinc-600 inline focus:text-white" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full min-h-[500px] flex flex-col">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              Intelligence Analysis
            </h2>
            
            {selectedThreat ? (
              <div className="flex flex-col flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Selected Incident</h3>
                  <p className="text-xl font-bold leading-tight">{selectedThreat.title}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{selectedThreat.description}</p>
                </div>

                <div className="h-px bg-zinc-800" />

                {selectedThreat.remediation ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-indigo-600/10 rounded-xl border border-indigo-600/20">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">AI Root Cause Analysis</h4>
                      <p className="text-sm text-zinc-200">{selectedThreat.summary || "Summary loading..."}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase">Remediation Steps</h4>
                      <div className="text-sm text-zinc-300 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 whitespace-pre-wrap">
                        {selectedThreat.remediation}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                      <span className="text-xs font-medium text-zinc-500">Risk Score</span>
                      <span className="text-lg font-bold text-red-500">{selectedThreat.riskScore}/100</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                      <BrainCircuit className={cn("w-8 h-8 text-zinc-600", analyzing && "text-indigo-400 animate-pulse")} />
                    </div>
                    <div>
                      <p className="text-zinc-300 font-medium">Ready for Analysis</p>
                      <p className="text-xs text-zinc-500 mt-1 px-8">Run Gemini-powered reconnaissance to identify root causes and mitigation strategies.</p>
                    </div>
                    <button 
                      onClick={() => handleAIAnalyze(selectedThreat)}
                      disabled={analyzing}
                      className={cn(
                        "mt-4 px-6 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center gap-2",
                        analyzing && "animate-pulse"
                      )}
                    >
                      {analyzing ? "Synthesizing..." : "Run AI Analysis"}
                    </button>
                  </div>
                )}

                <div className="mt-auto pt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg text-sm font-bold hover:bg-red-600/20 transition-colors">
                    Isolate Host
                  </button>
                  <button className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-bold hover:bg-zinc-700 transition-colors">
                    Acknowledge
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select an incident from the feed to view full intelligence reporting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
