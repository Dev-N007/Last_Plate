import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UrgencyLevel } from '../../types';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  minutesRemaining?: number;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  minutesRemaining,
  className = ''
}) => {
  const formatTime = (mins?: number) => {
    if (!mins || mins <= 0) return 'Expired';
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours === 0) return `${m}m left`;
    return `${hours}h ${m}m left`;
  };

  switch (urgency) {
    case 'critical':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C64E42]/15 text-[#C64E42] border border-[#C64E42]/30 animate-pulse-subtle ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Critical: {formatTime(minutesRemaining)}</span>
        </span>
      );

    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCA647]/15 text-[#9E6E18] border border-[#DCA647]/30 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Urgent: {formatTime(minutesRemaining)}</span>
        </span>
      );

    case 'normal':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#163D2B]/10 text-[#163D2B] border border-[#163D2B]/20 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{formatTime(minutesRemaining)}</span>
        </span>
      );

    case 'expired':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-600 border border-neutral-300 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Expired</span>
        </span>
      );
  }
};
