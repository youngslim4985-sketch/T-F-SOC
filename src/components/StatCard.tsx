import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, className, description }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "p-6 rounded-2xl bg-[#0f0f12] border border-zinc-800 transition-colors hover:border-zinc-700",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-zinc-800/50 rounded-xl">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            trend.isUp ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
          )}>
            {trend.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-zinc-500 text-sm font-medium mb-1 tracking-wide">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        {description && <p className="text-xs text-zinc-600 mt-2 font-mono">{description}</p>}
      </div>
    </motion.div>
  );
}
