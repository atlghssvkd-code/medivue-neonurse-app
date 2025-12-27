"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hospital, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function HospitalLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = async (action: 'signIn' | 'signUp') => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      if (action === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast({
        title: action === 'signIn' ? 'Login Successful' : 'Account Created',
        description: "Redirecting to dashboard...",
      });
      router.push('/dashboard/hospital');
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: err.message,
      });
    }
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
                    <CardTitle className="text-3xl font-headline text-left">Hospital Access</CardTitle>
                    <CardDescription className="text-left">Admin access to all patient dashboards.</CardDescription>
                </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={(e) => {e.preventDefault(); handleAuthAction('signIn')}} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
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
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={(e) => {e.preventDefault(); handleAuthAction('signUp')}} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="Choose a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full !mt-6">
                    Sign Up
                  </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Button variant="ghost" className="mt-8" asChild>
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to main page</Link>
      </Button>
    </div>
  );
}
