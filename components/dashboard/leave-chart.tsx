'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateLeaveSummary } from '@/lib/data';

interface LeaveChartProps {
  userId: string;
}

export function LeaveChart({ userId }: LeaveChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const summary = calculateLeaveSummary(userId);
    
    const data = [
      { name: 'Approved', value: summary.approved, color: 'hsl(var(--chart-2))' },
      { name: 'Pending', value: summary.pending, color: 'hsl(var(--chart-4))' },
      { name: 'Rejected', value: summary.rejected, color: 'hsl(var(--chart-5))' },
    ].filter(item => item.value > 0);

    // Add dummy data if all are zero to prevent chart errors
    if (data.length === 0) {
      data.push({ name: 'No Leaves', value: 1, color: 'hsl(var(--muted))' });
    }
    
    setChartData(data);
  }, [userId]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[12px] font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} leaves`, 'Count']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }} 
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}