import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Users, CheckCircle2, UserMinus, BarChart3, Activity } from 'lucide-react';

interface MetricPoint {
  stage: string;
  shortLabel: string;
  finished: number;
  droppedOff: number;
  retentionRate: number;
}

interface DailyTrendPoint {
  day: string;
  finished: number;
  droppedOff: number;
  completionRate: number;
}

// Data: Reading depth funnel (Drop-off curve across article length)
const READING_DEPTH_DATA: MetricPoint[] = [
  { stage: 'Intro & Lead (0–20%)', shortLabel: 'Lead', finished: 14200, droppedOff: 850, retentionRate: 94.3 },
  { stage: 'Context & Background (20–40%)', shortLabel: 'Context', finished: 13100, droppedOff: 1950, retentionRate: 87.0 },
  { stage: 'Core Investigation (40–60%)', shortLabel: 'Analysis', finished: 11800, droppedOff: 3250, retentionRate: 78.4 },
  { stage: 'Deeper Synthesis (60–80%)', shortLabel: 'Synthesis', finished: 10400, droppedOff: 4650, retentionRate: 69.1 },
  { stage: 'Conclusion & Sources (80–100%)', shortLabel: 'Full Finish', finished: 9650, droppedOff: 5400, retentionRate: 64.1 },
];

// Data: 7-day reader completion trend
const WEEKLY_TREND_DATA: DailyTrendPoint[] = [
  { day: 'Mon', finished: 12400, droppedOff: 3800, completionRate: 76.5 },
  { day: 'Tue', finished: 14100, droppedOff: 4100, completionRate: 77.4 },
  { day: 'Wed', finished: 15800, droppedOff: 4300, completionRate: 78.6 },
  { day: 'Thu', finished: 16200, droppedOff: 4200, completionRate: 79.4 },
  { day: 'Fri', finished: 18900, droppedOff: 4900, completionRate: 79.4 },
  { day: 'Sat', finished: 21400, droppedOff: 4700, completionRate: 81.9 },
  { day: 'Sun', finished: 23900, droppedOff: 4800, completionRate: 83.2 },
];

export const ReaderEngagementChart: React.FC = () => {
  const [activeView, setActiveView] = useState<'depth' | 'weekly'>('depth');

  // Custom Editorial Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const finishedVal = payload.find((p: any) => p.dataKey === 'finished')?.value || 0;
      const droppedVal = payload.find((p: any) => p.dataKey === 'droppedOff')?.value || 0;
      const totalReaders = finishedVal + droppedVal;
      const rate = totalReaders > 0 ? ((finishedVal / totalReaders) * 100).toFixed(1) : '0';

      return (
        <div className="bg-stone-900 text-stone-100 border border-stone-700 p-3 shadow-xl rounded-xs text-xs font-sans max-w-xs">
          <div className="font-bold text-stone-200 border-b border-stone-800 pb-1.5 mb-2 font-editorial-headline text-sm">
            {label}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Finished Article:
              </span>
              <span className="font-mono font-bold text-white">
                {finishedVal.toLocaleString()} readers
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Dropped Off:
              </span>
              <span className="font-mono font-bold text-white">
                {droppedVal.toLocaleString()} readers
              </span>
            </div>
            <div className="pt-1.5 border-t border-stone-800 flex items-center justify-between text-stone-400 text-[11px]">
              <span>Completion Efficiency:</span>
              <span className="font-bold text-emerald-400 font-mono">{rate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-10 border border-stone-800 bg-stone-950/70 p-5 sm:p-7 rounded-xs">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-editorial-headline text-lg sm:text-xl font-bold text-stone-100">
              Reader Engagement & Completion Analytics
            </h3>
          </div>
          <p className="text-xs text-stone-400 font-sans">
            Independent telemetry auditing verified reader dwell time, milestone retention, and drop-off rates.
          </p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex items-center border border-stone-700 p-0.5 rounded-xs bg-stone-900 shrink-0 self-start sm:self-auto text-xs font-sans">
          <button
            onClick={() => setActiveView('depth')}
            className={`px-3 py-1 font-semibold transition-colors rounded-xs flex items-center gap-1.5 ${
              activeView === 'depth'
                ? 'bg-stone-100 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Scroll Depth Drop-Off</span>
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-3 py-1 font-semibold transition-colors rounded-xs flex items-center gap-1.5 ${
              activeView === 'weekly'
                ? 'bg-stone-100 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Completion Trend</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px] uppercase tracking-wider font-sans mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avg. Article Finish Rate</span>
          </div>
          <div className="text-xl font-bold text-stone-100 font-mono">78.4%</div>
          <div className="text-[10px] text-stone-500 font-sans mt-0.5">+4.2% above broadsheet benchmark</div>
        </div>

        <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px] uppercase tracking-wider font-sans mb-1">
            <UserMinus className="w-3.5 h-3.5 text-amber-400" />
            <span>Early Drop-Off Window</span>
          </div>
          <div className="text-xl font-bold text-stone-100 font-mono">21.6%</div>
          <div className="text-[10px] text-stone-500 font-sans mt-0.5">Primarily between 40%–60% mark</div>
        </div>

        <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px] uppercase tracking-wider font-sans mb-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Readers Audited</span>
          </div>
          <div className="text-xl font-bold text-stone-100 font-mono">142.8k</div>
          <div className="text-[10px] text-stone-500 font-sans mt-0.5">Across 8 editorial news desks</div>
        </div>

        <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px] uppercase tracking-wider font-sans mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Weekend Peak Finish</span>
          </div>
          <div className="text-xl font-bold text-stone-100 font-mono">83.2%</div>
          <div className="text-[10px] text-stone-500 font-sans mt-0.5">Sunday long-form dispatches</div>
        </div>
      </div>

      {/* Main Recharts Visualization */}
      <div className="w-full h-72 sm:h-80 pt-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'depth' ? (
            <AreaChart
              data={READING_DEPTH_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="finishedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="droppedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="shortLabel"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <YAxis
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'sans-serif' }}
                formatter={(value) => {
                  return value === 'finished' ? 'Finished Article' : 'Dropped Off';
                }}
              />
              <Area
                type="monotone"
                dataKey="finished"
                name="finished"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#finishedGrad)"
              />
              <Area
                type="monotone"
                dataKey="droppedOff"
                name="droppedOff"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#droppedGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={WEEKLY_TREND_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <YAxis
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'sans-serif' }}
                formatter={(value) => {
                  return value === 'finished' ? 'Finished Article' : 'Dropped Off';
                }}
              />
              <Bar dataKey="finished" name="finished" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="droppedOff" name="droppedOff" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Note */}
      <div className="mt-3 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-sans gap-2">
        <span>
          * Analysis aggregated from verified reader sessions with reading progress bar and audio narration dwell metrics.
        </span>
        <span className="text-stone-400 font-medium">
          Target Editorial Benchmark: ≥ 65% Full Finish
        </span>
      </div>
    </div>
  );
};
