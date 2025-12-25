'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Patient } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  systolic: {
    label: 'Systolic',
    color: 'hsl(var(--chart-1))',
  },
  diastolic: {
    label: 'Diastolic',
    color: 'hsl(var(--chart-2))',
  },
  pulse: {
    label: 'Pulse',
    color: 'hsl(var(--chart-3))',
  },
  temperature: {
    label: 'Temp',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

type ChartDataKey = 'bloodPressure' | 'pulse' | 'temperature';

interface PatientVitalsChartProps {
    patient: Patient;
    chartType: ChartDataKey;
}

export function PatientVitalsChart({ patient, chartType }: PatientVitalsChartProps) {
  
  const { title, chartData, dataKeys, unit } = useMemo(() => {
    switch (chartType) {
      case 'bloodPressure':
        return {
          title: 'Blood Pressure (mmHg)',
          chartData: patient.vitals.history.bloodPressure.map(d => ({ 
              time: d.time, 
              systolic: (d.value as {systolic: number}).systolic, 
              diastolic: (d.value as {systolic: number; diastolic: number}).diastolic 
            })),
          dataKeys: ['systolic', 'diastolic'],
          unit: 'mmHg',
        };
      case 'pulse':
        return {
          title: 'Pulse (bpm)',
          chartData: patient.vitals.history.pulse.map(d => ({ time: d.time, pulse: d.value })),
          dataKeys: ['pulse'],
          unit: 'bpm',
        };
      case 'temperature':
        return {
          title: 'Temperature (°C)',
          chartData: patient.vitals.history.temperature.map(d => ({ time: d.time, temperature: d.value })),
          dataKeys: ['temperature'],
          unit: '°C',
        };
      default:
        return { title: '', chartData: [], dataKeys: [], unit: '' };
    }
  }, [patient, chartType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                style={{ fontSize: '12px' }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip cursor={{fill: 'hsl(var(--accent))', opacity: 0.2}} content={<ChartTooltipContent indicator="dot" />} />
              {dataKeys.map(key => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig[key as keyof typeof chartConfig]?.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
