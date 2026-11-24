import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

const COLORS = ['#0A84FF','#00C9A7','#34D399','#5E5CE6','#FF9F0A','#FF453A','#64D2FF'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0A1A2E', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, padding:'10px 14px' }}>
      <div style={{ fontSize:12, color:'var(--text-2)', marginBottom:4 }}>{payload[0].name}</div>
      <div style={{ fontSize:15, fontWeight:800, color:payload[0].payload.fill }}>
        {formatCurrency(payload[0].value, 'USD')}
      </div>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const rad = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + rad * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + rad * Math.sin(-midAngle * Math.PI / 180);
  return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>{`${(percent*100).toFixed(0)}%`}</text>;
};

export default function SpendingBreakdownChart({ data = [] }) {
  const items = (data || []).slice(0, 7).map((d, i) => ({
    name: d.category || 'Other',
    value: parseFloat(d.amount || 0),
    fill: COLORS[i % COLORS.length],
  }));

  if (!items.length) {
    items.push(
      { name: 'Payroll',            value: 465000, fill: COLORS[0] },
      { name: 'Cloud Infrastructure', value: 147000, fill: COLORS[1] },
      { name: 'SaaS Subscriptions', value: 46200,  fill: COLORS[2] },
      { name: 'Legal & Compliance', value: 95000,  fill: COLORS[3] },
      { name: 'Revenue (Net)',       value: 950000, fill: COLORS[4] },
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={items} cx="50%" cy="50%"
          innerRadius={55} outerRadius={88}
          paddingAngle={3} dataKey="value"
          labelLine={false} label={renderCustomLabel}
          animationBegin={0} animationDuration={800}
        >
          {items.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle" iconSize={7}
          wrapperStyle={{ fontSize:11, color:'var(--text-2)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
