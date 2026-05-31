import React from 'react';
import { motion } from 'motion/react';
import { Globe, ShieldAlert, Cpu, Box, Search, ChevronRight, Zap } from 'lucide-react';
import { mockAssets } from '../data';
import StatCard from './StatCard';
import { cn } from '@/src/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AttackSurface() {
  const chartData = [
    { name: 'Gateway', exposure: 42 },
    { name: 'Database', exposure: 12 },
    { name: 'Endpoints', exposure: 88 },
    { name: 'Storage', exposure: 24 },
    { name: 'Apps', exposure: 65 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Monitored Assets" 
          value={mockAssets.length} 
          icon={Globe} 
          description="Total nodes in inventory"
        />
        <StatCard 
          title="Critical Vulnerabilities" 
          value={42} 
          icon={ShieldAlert} 
          trend={{ value: 2.1, isUp: false }}
          description="CVEs discovered this week"
        />
        <StatCard 
          title="Exposure Score" 
          value="Medium" 
          icon={Zap} 
          description="Aggregated surface risk"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exposure Trends */}
        <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold">Attack Surface Index</h2>
              <p className="text-sm text-zinc-500">Resource-wise exposure distribution</p>
            </div>
            <Box className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="name" 
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
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="exposure" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Inventory */}
        <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-xl font-bold">Asset Inventory</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {mockAssets.map((asset) => (
              <div 
                key={asset.id}
                className="group flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-colors">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200">{asset.hostname}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">{asset.ip} • {asset.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-400">Score</p>
                    <p className={cn(
                      "text-sm font-mono font-bold",
                      asset.exposureScore > 70 ? "text-red-500" : asset.exposureScore > 40 ? "text-yellow-500" : "text-green-500"
                    )}>
                      {asset.exposureScore}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700" />
                </div>
              </div>
            ))}
          </div>
          <button className="p-4 text-center text-xs font-bold text-zinc-500 hover:text-white transition-colors border-t border-zinc-800">
            View All Assets
          </button>
        </div>
      </div>
    </div>
  );
}
