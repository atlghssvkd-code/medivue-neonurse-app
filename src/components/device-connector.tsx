"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff, Loader2, Play, StopCircle } from 'lucide-react';
import type { Vitals } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface DeviceConnectorProps {
    onVitalsUpdate: (newVitals: Partial<Vitals>) => void;
}

export function DeviceConnector({ onVitalsUpdate }: DeviceConnectorProps) {
    const { toast } = useToast();
    const [ipAddress, setIpAddress] = useState('10.187.241.46');
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const startMonitoring = useCallback(async () => {
        if (!ipAddress) {
            toast({ variant: 'destructive', title: 'IP Address Required', description: 'Please enter the ESP32 IP address.' });
            return;
        }
        
        setIsLoading(true);

        const url = `http://${ipAddress}/vitals`;

        // Function to perform a single fetch
        const pollVitals = async () => {
            try {
                // The AbortController is used to set a timeout for the fetch request.
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 second timeout
                
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Partial<Vitals> = await response.json();
                onVitalsUpdate(data);

            } catch (error: any) {
                console.error('Failed to fetch vitals:', error.message);
                // Stop polling on error to prevent constant failed requests
                stopMonitoring(); 
                toast({
                    variant: 'destructive',
                    title: 'Connection Error',
                    description: `Could not connect to ${ipAddress}. Check the IP and network.`,
                });
            }
        };

        // Perform an initial fetch to validate the connection
        try {
            await pollVitals();
            setIsMonitoring(true);
            setIsLoading(false);
            toast({ title: 'Monitoring Started', description: `Connected to device at ${ipAddress}.` });
            // If initial fetch is successful, start polling every 3 seconds
            pollingRef.current = setInterval(pollVitals, 3000);
        } catch (e) {
            // Error toast is already handled in pollVitals
            setIsLoading(false);
        }

    }, [ipAddress, onVitalsUpdate, toast]);

    const stopMonitoring = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        setIsMonitoring(false);
        setIsLoading(false);
        toast({ title: 'Monitoring Stopped' });
    }, [toast]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    {isMonitoring ? <Wifi className="mr-2 h-4 w-4 text-green-500" /> : <WifiOff className="mr-2 h-4 w-4" />}
                    {isMonitoring ? 'Connected' : 'Connect Device'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Connect to ESP32</h4>
                        <p className="text-sm text-muted-foreground">
                            Enter the local IP address of your ESP32 device.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="ip">IP Address</Label>
                            <Input
                                id="ip"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                placeholder="e.g., 192.168.1.100"
                                className="col-span-2 h-8"
                                disabled={isMonitoring || isLoading}
                            />
                        </div>
                    </div>
                     {isMonitoring ? (
                        <Button onClick={stopMonitoring} variant="destructive" size="sm">
                            <StopCircle className="mr-2 h-4 w-4" /> Stop Monitoring
                        </Button>
                    ) : (
                        <Button onClick={startMonitoring} disabled={isLoading || !ipAddress} size="sm">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                            Start Monitoring
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
