import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, change, trend, color }) => {
  const getColorClasses = (colorName) => {
    const colorMap = {
      purple: {
        border: 'border-t-purple-600',
        bg: 'from-purple-600/20 to-purple-500/10',
        accent: 'bg-gradient-purple',
        progress: 'from-purple-600 to-purple-500'
      },
      cyan: {
        border: 'border-t-cyan-400',
        bg: 'from-cyan-400/20 to-cyan-500/10',
        accent: 'bg-gradient-cyan',
        progress: 'from-cyan-400 to-cyan-500'
      },
      teal: {
        border: 'border-t-teal-400',
        bg: 'from-teal-400/20 to-teal-500/10',
        accent: 'bg-gradient-teal',
        progress: 'from-teal-400 to-teal-500'
      },
      pink: {
        border: 'border-t-pink-400',
        bg: 'from-pink-400/20 to-pink-500/10',
        accent: 'bg-gradient-pink',
        progress: 'from-pink-400 to-pink-500'
      }
    };
    return colorMap[colorName] || colorMap.purple;
  };

  const colorClasses = getColorClasses(color);
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20';

  return (
    <div className={`glass-card p-6 relative overflow-hidden border-t-4 ${colorClasses.border}`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-50`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-semibold text-white/70 leading-tight">
            {title}
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{change}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white leading-none">
              {value}
            </span>
            <span className="text-base text-white/70 font-medium">
              {subtitle}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full w-[70%] bg-gradient-to-r ${colorClasses.progress} rounded-full transition-all duration-1000 ease-out`}></div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;