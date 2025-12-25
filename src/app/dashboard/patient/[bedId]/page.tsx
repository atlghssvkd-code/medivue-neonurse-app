import { mockPatients } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import {
  HeartPulse,
  Thermometer,
  Wind,
  Droplets,
  BedDouble,
  Bell,
  Clock,
  Pill,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  PersonStanding,
  User,
  Siren,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VitalsCard } from "./_components/vitals-card";
import { PatientVitalsChart } from "@/components/patient-vitals-chart";
import { MovementSleepChart } from "@/components/movement-sleep-chart";
import { PressureSoreRisk } from "@/components/pressure-sore-risk";

export default function PatientDashboardPage({ params }: { params: { bedId: string } }) {
  const patient = mockPatients.find(p => p.bedId.toLowerCase() === params.bedId.toLowerCase());

  if (!patient) {
    notFound();
  }

  const getAlertInfo = (priority: 'Emergency' | 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'Emergency':
        return { variant: 'destructive', icon: <Siren className="h-4 w-4" /> };
      case 'High':
        return { variant: 'destructive', icon: <AlertCircle className="h-4 w-4" />, className: "bg-orange-500 hover:bg-orange-600 border-orange-500" };
      case 'Medium':
        return { variant: 'secondary', icon: <AlertTriangle className="h-4 w-4" /> };
      default:
        return { variant: 'outline', icon: <ShieldCheck className="h-4 w-4" /> };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
            <p className="text-muted-foreground">Detailed view for <span className="font-semibold text-primary">{patient.name}</span></p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><User /> {patient.age} / {patient.sex.charAt(0)}</div>
            <div className="flex items-center gap-2"><BedDouble /> Bed {patient.bedId}</div>
          </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VitalsCard initialVitals={patient.vitals} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PatientVitalsChart patient={patient} chartType="bloodPressure" />
        <PatientVitalsChart patient={patient} chartType="pulse" />
        <PatientVitalsChart patient={patient} chartType="temperature" />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 grid gap-4">
            <MovementSleepChart patient={patient} />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Alerts & Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Active Alerts</h4>
                        {patient.alerts.length > 0 ? (
                            <ul className="space-y-2">
                            {patient.alerts.map(alert => {
                                const { variant, icon, className } = getAlertInfo(alert.priority);
                                return (
                                <li key={alert.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={variant} className={`flex items-center gap-2 ${className}`}>{icon} {alert.priority}</Badge>
                                        <span>{alert.type}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                </li>
                                );
                            })}
                            </ul>
                        ) : <p className="text-sm text-muted-foreground">No active alerts.</p>}
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Upcoming Reminders</h4>
                        {patient.reminders.length > 0 ? (
                            <ul className="space-y-2">
                                {patient.reminders.map(reminder => (
                                <li key={reminder.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{reminder.title}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{reminder.time}</span>
                                </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-muted-foreground">No upcoming reminders.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 grid gap-4">
            <PressureSoreRisk patient={patient} />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /> Medication Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {patient.medications.map(med => (
                        <li key={med.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{med.name} <span className="text-sm text-muted-foreground">{med.dosage}</span></p>
                                <p className="text-xs text-muted-foreground">Scheduled at {med.time}</p>
                            </div>
                            <Badge variant={med.status === 'Taken' ? 'default' : 'secondary'} className={med.status === 'Taken' ? 'bg-green-500' : ''}>
                                {med.status}
                            </Badge>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
        </div>
      </div>
    </div>
  );
}
