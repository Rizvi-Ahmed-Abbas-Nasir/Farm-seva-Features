import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({ data, title, centerText }) => {
  const RADIAN = Math.PI / 180;

  // Label in the middle of each slice
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Tooltip customization
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 p-2 rounded-md text-white shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{`Value: ${data.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="relative w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#1f1f1f"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Animated Center Text */}
        {centerText && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-3xl font-bold text-white animate-pulse">{centerText}</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {data.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-xl transition transform hover:scale-105"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/70 text-xs font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
