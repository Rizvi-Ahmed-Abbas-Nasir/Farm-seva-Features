import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AreaChart = ({ data, title, xDataKey, yDataKeys, areaColors, areaNames }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-gray-800 p-2 rounded-md text-white">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs m-1">
              {`${areaNames[index] || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="w-full h-[80%]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey={xDataKey} 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12} 
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12} 
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }} />
            
            {yDataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={areaColors[index]}
                fill={`url(#areaGradient${index})`}
                strokeWidth={2}
              />
            ))}

            {areaColors.map((color, index) => (
              <defs key={index}>
                <linearGradient id={`areaGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.6}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChart;
