"use client"

import {
  HeartPulse,
  Thermometer,
  Wind,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vitals } from "@/lib/types";
import { useEffect, useState } from "react";

const vitalsConfig = [
    { key: "bloodPressure", label: "Blood Pressure", unit: "mmHg", icon: HeartPulse },
    { key: "pulse", label: "Pulse", unit: "bpm", icon: HeartPulse },
    { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer },
    { key: "spo2", label: "SpO2", unit: "%", icon: Droplets },
    { key: "respiratoryRate", label: "Resp. Rate", unit: "breaths/min", icon: Wind },
] as const;

export function VitalsCard({ initialVitals }: { initialVitals: Vitals }) {
    const [vitals, setVitals] = useState(initialVitals);

    useEffect(() => {
        const interval = setInterval(() => {
            setVitals(prev => ({
                ...prev,
                pulse: prev.pulse + Math.floor(Math.random() * 3) - 1,
                spo2: Math.max(90, Math.min(100, prev.spo2 + Math.floor(Math.random() * 3) - 1)),
                respiratoryRate: Math.max(12, Math.min(25, prev.respiratoryRate + Math.floor(Math.random() * 3) - 1)),
            }));
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const getVitalDisplay = (key: keyof Vitals) => {
        const value = vitals[key];
        const config = vitalsConfig.find(v => v.key === key);
        return {
            ...config,
            value,
        };
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{vitals.bloodPressure} <span className="text-xs text-muted-foreground">mmHg</span></div>
                    <p className="text-xs text-muted-foreground">Systolic/Diastolic</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pulse</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{vitals.pulse} <span className="text-xs text-muted-foreground">bpm</span></div>
                    <p className="text-xs text-muted-foreground">Normal range: 60-100</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{vitals.temperature} <span className="text-xs text-muted-foreground">°C</span></div>
                    <p className="text-xs text-muted-foreground">Last updated 1h ago</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">SpO2</CardTitle>
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{vitals.spo2} <span className="text-xs text-muted-foreground">%</span></div>
                    <p className="text-xs text-muted-foreground">Oxygen Saturation</p>
                </CardContent>
            </Card>
        </>
    );
}
