'use client';

import { Bed } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  sleepLevel: {
    label: 'Sleep Stage',
  },
} satisfies ChartConfig;

const sleepStageLabels: { [key: number]: string } = {
  1: 'Awake',
  2: 'Light',
  3: 'Deep',
  4: 'REM',
};

const sleepStageColors: { [key: number]: string } = {
    1: 'hsl(var(--chart-5))', // Awake
    2: 'hsl(var(--chart-4))', // Light
    3: 'hsl(var(--chart-2))', // Deep
    4: 'hsl(var(--chart-1))', // REM
};


export function MovementSleepChart({ patient }: { patient: Patient }) {
  const chartData = useMemo(() => {
    return patient.movement.sleepPatterns.map(pattern => ({
      ...pattern,
      fill: sleepStageColors[pattern.level],
    }));
  }, [patient.movement.sleepPatterns]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Movement & Sleep Patterns</CardTitle>
        <CardDescription>Last night's sleep cycle analysis. Last moved: {patient.movement.lastMoved}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer>
            <BarChart 
                data={chartData} 
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                dataKey="level"
                tickFormatter={(value) => sleepStageLabels[value] || ''}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 5]}
                ticks={[1, 2, 3, 4]}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border rounded-md shadow-lg text-sm">
                        <p className="font-bold">{data.time}</p>
                        <p style={{ color: sleepStageColors[data.level] }}>
                          Stage: {sleepStageLabels[data.level]}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="level" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
