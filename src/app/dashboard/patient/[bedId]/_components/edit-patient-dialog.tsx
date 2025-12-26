
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/lib/types";
import { Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditPatientDialogProps {
  patient: Patient;
  onUpdate: (updatedData: Partial<Patient>) => void;
}

export function EditPatientDialog({ patient, onUpdate }: EditPatientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string, 10);
    const sex = formData.get("sex") as Patient['sex'];
    const medicalHistory = (formData.get("medicalHistory") as string)
      .split(',')
      .map(s => s.trim());

    const updatedData: Partial<Patient> = { name, age, sex, medicalHistory };
    onUpdate(updatedData);

    toast({
      title: "Patient Details Updated",
      description: `${name}'s information has been successfully saved.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Patient Details</DialogTitle>
            <DialogDescription>
              Update patient information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={patient.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                defaultValue={patient.age}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Sex</Label>
              <RadioGroup
                name="sex"
                defaultValue={patient.sex}
                className="col-span-3 flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="sex-male" />
                  <Label htmlFor="sex-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="sex-female" />
                  <Label htmlFor="sex-female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="medicalHistory" className="text-right pt-2">
                Medical History
              </Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                placeholder="Comma-separated (e.g., Hypertension, Diabetes)"
                defaultValue={patient.medicalHistory.join(', ')}
                className="col-span-3"
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
