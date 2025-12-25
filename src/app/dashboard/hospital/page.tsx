"use client";
import * as React from "react"
import Link from "next/link"
import {
  AlertCircle,
  AlertTriangle,
  BedDouble,
  HeartPulse,
  PlusCircle,
  Thermometer,
  User,
  Wind,
} from "lucide-react"

import { mockPatients, createNewPatient } from "@/lib/mock-data"
import type { Patient } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

function AddBedDialog({ onAddPatient }: { onAddPatient: (newPatient: Patient) => void }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const nextBedId = React.useMemo(() => {
    const lastBed = mockPatients[mockPatients.length - 1];
    if (!lastBed) return "101A";
    const lastBedNum = parseInt(lastBed.bedId.slice(0, -1));
    const lastBedChar = lastBed.bedId.slice(-1);
    
    if (lastBedChar === 'D') {
      return `${lastBedNum + 1}A`;
    }
    return `${lastBedNum}${String.fromCharCode(lastBedChar.charCodeAt(0) + 1)}`;

  }, [mockPatients]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bedId = formData.get("bedId") as string;
    const patientName = formData.get("patientName") as string;
    
    const newPatient = createNewPatient(patientName, bedId);
    onAddPatient(newPatient);
    
    toast({
      title: "Bed Added Successfully",
      description: `Bed ${bedId} for patient ${patientName} has been created.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add New Bed
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>
              Assign a new patient to a bed. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="patientName"
                name="patientName"
                placeholder="Enter patient's name"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bedId" className="text-right">
                Bed ID
              </Label>
              <Input id="bedId" name="bedId" defaultValue={nextBedId} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PatientCard({ patient }: { patient: Patient }) {
  const emergencyAlert = patient.alerts.find(a => a.priority === "Emergency")
  const highAlert = patient.alerts.find(a => a.priority === "High")

  const getAlertVariant = () => {
    if (emergencyAlert) return "destructive"
    if (highAlert) return "secondary"
    return "outline"
  }

  const getAlertIcon = () => {
    if (emergencyAlert) return <AlertCircle className="h-4 w-4 text-destructive-foreground" />
    if (highAlert) return <AlertTriangle className="h-4 w-4 text-secondary-foreground" />
    return null;
  }
  
  const alertText = emergencyAlert?.type || highAlert?.type;

  return (
    <Card className="hover:bg-card/95 hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{patient.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BedDouble className="h-4 w-4" />
            <span>{patient.bedId}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <User className="h-4 w-4"/>
          <span>{patient.age} years old, {patient.sex}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary"/> BP: {patient.vitals.bloodPressure}</div>
            <div className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary"/> Pulse: {patient.vitals.pulse} bpm</div>
            <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary"/> Temp: {patient.vitals.temperature}°C</div>
            <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-primary"/> SpO2: {patient.vitals.spo2}%</div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-between items-center">
        {alertText ? (
            <Badge variant={getAlertVariant()} className="flex gap-2 items-center">
                {getAlertIcon()}
                {alertText}
            </Badge>
        ) : <div />}
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/patient/${patient.bedId}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function HospitalDashboard() {
  const [patients, setPatients] = React.useState<Patient[]>(mockPatients);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prevPatients => [...prevPatients, newPatient]);
    // Also update mockPatients so new patient is available on other pages
    mockPatients.push(newPatient);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h1>
            <p className="text-muted-foreground">Overview of all patient statuses.</p>
        </div>
        <AddBedDialog onAddPatient={handleAddPatient} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </>
  )
}