"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hospital, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function HospitalLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    // In a real app, you would authenticate against a backend.
    // For this demo, any input is valid.
    router.push('/dashboard/hospital');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-secondary rounded-full mr-4">
                    <Hospital className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-headline text-left">Hospital Login</CardTitle>
                    <CardDescription className="text-left">Admin access to all patient dashboards.</CardDescription>
                </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full !mt-6">
              Login
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
