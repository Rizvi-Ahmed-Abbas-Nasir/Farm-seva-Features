import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChart = ({ data, title, xDataKey, yDataKey, barColor }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-gray-800 p-2 rounded-md text-white">
          <p className="tooltip-label">{`${xDataKey}: ${label}`}</p>
          <p style={{ color: barColor }} className="text-xs m-1">
            {`${yDataKey}: ${payload[0].value}`}
          </p>
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

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
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
            <Bar 
              dataKey={yDataKey} 
              fill={barColor} 
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
