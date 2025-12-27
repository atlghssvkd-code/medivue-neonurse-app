"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { mockPatients } from '@/lib/mock-data';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function PatientLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [bedId, setBedId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!bedId.trim()) {
      setError('Bed ID is required.');
      return;
    }
    
    const patientExists = mockPatients.some(p => p.bedId.toLowerCase() === bedId.trim().toLowerCase());

    if (patientExists) {
      try {
        await signInAnonymously(auth);
        toast({
          title: "Access Granted",
          description: "Redirecting to patient dashboard...",
        });
        router.push(`/dashboard/patient/${bedId.trim().toUpperCase()}`);
      } catch (err: any) {
        setError('Anonymous sign-in failed. Please try again.');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: err.message,
        });
      }
    } else {
      setError('Invalid Bed ID. Please check the ID and try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-secondary rounded-full mr-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
                <CardTitle className="text-3xl font-headline text-left">Patient Login</CardTitle>
                <CardDescription className="text-left">Enter your Bed ID to access the dashboard.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bedId" className="text-lg">Bed ID</Label>
              <Input
                id="bedId"
                type="text"
                placeholder="e.g., 101A"
                value={bedId}
                onChange={(e) => {
                  setBedId(e.target.value);
                  setError('');
                }}
                className="text-lg p-6"
                required
              />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full text-lg p-6">
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
      <Button variant="ghost" className="mt-8" asChild>
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to main page</Link>
      </Button>
    </div>
  );
}
