import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECENT_ACTIVITIES = [
  { icon: CheckCircle2, text: 'Rescued 15 portions of Warm Biryani & Raita by Hope Community Kitchen', time: '12m ago', type: 'success' },
  { icon: Clock, text: 'Urgent: 8 portions of Artisan Sourdough approaching pickup cutoff', time: '1h 14m left', type: 'urgent' },
  { icon: Leaf, text: 'Milestone reached: 45 kg CO₂ equivalent emissions avoided today', time: 'Live', type: 'impact' },
  { icon: Sparkles, text: 'New verified kitchen joined: Student Center West Canteen', time: 'Just now', type: 'new' }
];

export const LiveActivityBar: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = RECENT_ACTIVITIES[index];
  const Icon = current.icon;

  return (
    <div className="w-full bg-[#F8F6EF] dark:bg-[#0D1C14] border-y border-[#DCE7D8] dark:border-[#1E3A2C] py-2.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#163D2B] dark:bg-[#D9F36A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#163D2B] dark:bg-[#D9F36A]"></span>
          </span>
          <span className="font-bold text-[#163D2B] dark:text-[#D9F36A] uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">
            <span className="hidden xs:inline">Live Network Pulse</span>
            <span className="xs:hidden">Live Pulse</span>
          </span>
          <span className="text-[#DCE7D8] dark:text-[#214232] shrink-0">|</span>
          <div className="flex items-center gap-1.5 min-w-0 flex-1 text-[#26332B] dark:text-[#D1E0D6]">
            <Icon className="w-3.5 h-3.5 text-[#163D2B] dark:text-[#D9F36A] shrink-0" />
            <span className="truncate font-medium text-[11px] sm:text-xs">{current.text}</span>
            <span className="text-[10px] sm:text-[11px] text-[#737C73] dark:text-[#95A599] shrink-0">({current.time})</span>
          </div>
        </div>

        <Link
          to="/discover"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#163D2B] dark:text-[#D9F36A] hover:underline shrink-0"
        >
          <span>View All Surplus</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
