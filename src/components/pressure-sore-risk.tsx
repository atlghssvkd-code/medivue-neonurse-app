"use client";

import { useState, useTransition } from 'react';
import { Lightbulb, Loader2, ShieldAlert, Activity, GitFork, AlertTriangle } from 'lucide-react';
import type { Patient } from '@/lib/types';
import type { PressureSoreRiskOutput } from '@/ai/flows/pressure-sore-risk-assessment';
import { getPressureSoreRisk } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PressureSoreRiskProps {
  patient: Patient;
}

export function PressureSoreRisk({ patient }: PressureSoreRiskProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PressureSoreRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssessment = () => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await getPressureSoreRisk(patient);
      if (response.riskLevel === 'Error') {
        setError(response.reasoning);
      } else {
        setResult(response);
      }
    });
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Preventive Alerts Tool</CardTitle>
            <CardDescription>AI-Powered Pressure Sore Risk Assessment</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center gap-4">
        {!result && !isPending && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Click to run an AI assessment on the patient's risk of developing pressure sores.</p>
            <Button onClick={handleAssessment} disabled={isPending}>
              <Activity className="mr-2 h-4 w-4" /> Assess Risk
            </Button>
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing patient data...</p>
          </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Assessment Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {result && (
          <div className="w-full space-y-4 text-sm">
             {result.riskLevel.toLowerCase() === 'high' && (
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Preventive Alert Issued!</AlertTitle>
                    <AlertDescription>High risk of pressure sores detected. Immediate action recommended.</AlertDescription>
                </Alert>
            )}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base">Risk Level:</span>
              <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="text-base px-4 py-1">
                {result.riskLevel}
              </Badge>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><GitFork className="h-4 w-4 text-primary" />Reasoning</h4>
              <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md">{result.reasoning}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" />Recommendations</h4>
              <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md">{result.recommendations}</p>
            </div>
            <Button onClick={handleAssessment} disabled={isPending} variant="outline" className="w-full mt-4">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
               Re-assess Risk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
