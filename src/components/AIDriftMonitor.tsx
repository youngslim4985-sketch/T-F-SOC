import React from 'react';
import { motion } from 'motion/react';
import { Activity, Beaker, Zap, AlertTriangle, RefreshCw, BarChart4 } from 'lucide-react';
import { mockDrifts } from '../data';
import StatCard from './StatCard';
import { cn } from '@/src/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AIDriftMonitor() {
  const [activeModel, setActiveModel] = React.useState(mockDrifts[0]);
  const [analyzing, setAnalyzing] = React.useState(false);

  const driftHistory = [
    { time: '10:00', value: 0.92, baseline: 0.90 },
    { time: '11:00', value: 0.91, baseline: 0.90 },
    { time: '12:00', value: 0.88, baseline: 0.90 },
    { time: '13:00', value: 0.85, baseline: 0.90 },
    { time: '14:00', value: 0.82, baseline: 0.90 },
    { time: '15:00', value: 0.79, baseline: 0.90 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Models" 
          value={mockDrifts.length} 
          icon={Beaker} 
          description="Self-monitoring AI agents"
        />
        <StatCard 
          title="Avg Confidence" 
          value="94.2%" 
          icon={Zap} 
          trend={{ value: 0.5, isUp: true }}
          description="Fleet-wide inference stability"
        />
        <StatCard 
          title="Drift Anomalies" 
          value={mockDrifts.filter(d => d.isAnomalous).length} 
          icon={AlertTriangle} 
          trend={{ value: 1, isUp: true }}
          className="ring-1 ring-red-500/20"
          description="Models requiring retraining"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold">Inference Registry</h2>
          <div className="space-y-3">
            {mockDrifts.map((model) => (
              <button
                key={model.modelId}
                onClick={() => setActiveModel(model)}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-200",
                  activeModel.modelId === model.modelId 
                    ? "bg-indigo-600/10 border-indigo-600/30 ring-1 ring-indigo-500/20" 
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-zinc-100">{model.modelId}</span>
                  {model.isAnomalous && (
                    <div className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
                      Drift Detected
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Metric: {model.metricName}</span>
                  <span className={cn(
                    "font-mono font-bold",
                    model.isAnomalous ? "text-red-500" : "text-zinc-300"
                  )}>
                    {model.value} / {model.threshold}
                  </span>
                </div>
                <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(model.value / 1.0) * 100}%` }}
                    className={cn(
                      "h-full rounded-full",
                      model.isAnomalous ? "bg-red-500" : "bg-indigo-500"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold">{activeModel.modelId} Performance</h2>
                <p className="text-sm text-zinc-500">Temporal behavior & concept drift tracking</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <BarChart4 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={driftHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                  <Line type="monotone" dataKey="baseline" stroke="#52525b" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 tracking-widest">Self-Observation Log</h4>
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  "{activeModel.explanation || "No behavioral anomalies detected in last 24h sync cycle."}"
                </p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 tracking-widest">Sentinel Recommendation</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-200">
                      {activeModel.isAnomalous ? "Auto-Retrain Suggested" : "Maintenance Unnecessary"}
                    </p>
                    <p className="text-xs text-zinc-500">Current drift factor: 0.12</p>
                  </div>
                  <button className="px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
                    Optimize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
