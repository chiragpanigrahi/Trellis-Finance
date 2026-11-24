import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function LiquidityGaugeChart({ total = 0, idle = 0, currency = 'USD' }) {
  const pct = total > 0 ? Math.min(100, (idle / total) * 100) : 0;

  const data = [
    { name: 'Deployed',  value: 100 - pct, fill: 'rgba(10,132,255,.2)' },
    { name: 'Idle Cash', value: pct,       fill: '#00C9A7' },
  ];

  return (
    <div style={{ position:'relative', height:200 }}>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="55%" outerRadius="80%"
          data={data} startAngle={225} endAngle={-45}
          barSize={14}
        >
          <RadialBar
            minAngle={3} dataKey="value"
            cornerRadius={6} background={{ fill:'rgba(255,255,255,.04)' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div style={{ background:'#0A1A2E', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, padding:'8px 12px' }}>
                  <div style={{ fontSize:11, color:'var(--text-2)' }}>{payload[0].payload.name}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:payload[0].payload.fill }}>{payload[0].value.toFixed(1)}%</div>
                </div>
              );
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center text */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', textAlign:'center',
        pointerEvents:'none',
      }}>
        <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:3 }}>Idle</div>
        <div style={{ fontSize:22, fontWeight:900, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>
          {pct.toFixed(1)}%
        </div>
        <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>
          {formatCurrency(idle, currency, true)}
        </div>
      </div>
    </div>
  );
}
