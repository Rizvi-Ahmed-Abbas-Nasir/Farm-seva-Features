import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LineChart = ({ data, title }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-gray-800 p-2 rounded-md text-white">
          <p className="tooltip-label">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs m-1">
              {`${entry.name}: ${entry.value}`}
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
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <span className="bg-gradient-purple text-white px-3 py-1 rounded-2xl text-xs font-semibold">
            Max • 65
          </span>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
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
            
            {/* Pig Mortality Line */}
            <Line 
              type="monotone" 
              dataKey="pigMortality" 
              stroke="#ff5733" 
              strokeWidth={3}
              name="Pig Mortality"
              dot={{ fill: '#ff5733', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ff5733' }}
            />

            {/* Poultry Mortality Line */}
            <Line 
              type="monotone" 
              dataKey="poultryMortality" 
              stroke="#3498db" 
              strokeWidth={3}
              strokeDasharray="8 8"
              name="Poultry Mortality"
              dot={{ fill: '#3498db', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3498db' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
