
"use client";

import { mockPatients } from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";
import * as React from "react";
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
  Edit,
} from "lucide-react";
import type { Patient, Reminder } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VitalsCard } from "./_components/vitals-card";
import { PatientVitalsChart } from "@/components/patient-vitals-chart";
import { MovementSleepChart } from "@/components/movement-sleep-chart";
import { PressureSoreRisk } from "@/components/pressure-sore-risk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


function EditReminderDialog({ reminder, patient, onUpdate }: { reminder: Reminder, patient: Patient, onUpdate: (updatedReminder: Reminder) => void }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const time = formData.get("time") as string;

    const updatedReminder = { ...reminder, title, time };
    onUpdate(updatedReminder);
    
    toast({
      title: "Reminder Updated",
      description: `The reminder has been successfully updated.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogDescription>
              Update the details for this reminder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={reminder.title}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input 
                id="time" 
                name="time" 
                type="time" 
                defaultValue={reminder.time} 
                className="col-span-3" 
                required 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function PatientDashboardPage({ params }: { params: { bedId: string } }) {
  const router = useRouter();
  const [patient, setPatient] = React.useState(mockPatients.find(p => p.bedId.toLowerCase() === params.bedId.toLowerCase()));

  if (!patient) {
    notFound();
  }
  
  const handleReminderUpdate = (updatedReminder: Reminder) => {
    // This is where we would typically make an API call to update the backend.
    // For this mock, we update the state directly.
    const reminderIndex = patient.reminders.findIndex(r => r.id === updatedReminder.id);
    if (reminderIndex > -1) {
      const newReminders = [...patient.reminders];
      newReminders[reminderIndex] = updatedReminder;

      const newPatientState = { ...patient, reminders: newReminders };
      setPatient(newPatientState);

      // Also update the global mock data
      const mockPatientIndex = mockPatients.findIndex(p => p.id === patient.id);
      if (mockPatientIndex > -1) {
        mockPatients[mockPatientIndex] = newPatientState;
      }
    }
  };


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
                                <li key={reminder.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{reminder.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">{reminder.time}</span>
                                      <EditReminderDialog reminder={reminder} patient={patient} onUpdate={handleReminderUpdate} />
                                    </div>
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

    