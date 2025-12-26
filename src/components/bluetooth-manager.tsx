"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bluetooth, BluetoothConnected, BluetoothOff, Loader2 } from 'lucide-react';
import type { Vitals } from '@/lib/types';

// Standard Bluetooth Service and Characteristic UUIDs
const VITAL_SIGNS_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Heart Rate Service
const HEART_RATE_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'; // Heart Rate Measurement
const BLOOD_PRESSURE_CHARACTERISTIC_UUID = '00002a35-0000-1000-8000-00805f9b34fb'; // Blood Pressure Measurement
const TEMPERATURE_CHARACTERISTIC_UUID = '00002a1c-0000-1000-8000-00805f9b34fb'; // Temperature Measurement
const SPO2_CHARACTERISTIC_UUID = '00002a5f-0000-1000-8000-00805f9b34fb'; // Pulse Oximeter Continuous Measurement

interface BluetoothManagerProps {
    onVitalsUpdate: (newVitals: Partial<Vitals>) => void;
}

export function BluetoothManager({ onVitalsUpdate }: BluetoothManagerProps) {
    const { toast } = useToast();
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState<BluetoothDevice | null>(null);

    const handleConnect = async () => {
        if (!navigator.bluetooth) {
            toast({
                variant: 'destructive',
                title: 'Web Bluetooth Not Supported',
                description: 'Your browser does not support the Web Bluetooth API. Please use Chrome or Edge.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const bleDevice = await navigator.bluetooth.requestDevice({
                filters: [{ services: [VITAL_SIGNS_SERVICE_UUID] }],
                optionalServices: [VITAL_SIGNS_SERVICE_UUID]
            });

            toast({ title: 'Connecting...', description: `Pairing with ${bleDevice.name || 'device'}...` });
            const server = await bleDevice.gatt?.connect();
            setDevice(bleDevice);

            toast({ title: 'Connection Successful', description: `Connected to ${bleDevice.name}.` });
            setIsConnected(true);
            
            bleDevice.addEventListener('gattserverdisconnected', onDisconnected);

            // Get the service
            const service = await server?.getPrimaryService(VITAL_SIGNS_SERVICE_UUID);

            // --- Set up listeners for different vital signs ---

            // Heart Rate
            try {
                const hrCharacteristic = await service?.getCharacteristic(HEART_RATE_CHARACTERISTIC_UUID);
                await hrCharacteristic?.startNotifications();
                hrCharacteristic?.addEventListener('characteristicvaluechanged', handleHeartRateChanged);
            } catch (error) {
                console.warn("Heart Rate characteristic not found or failed to start notifications.");
            }
            
            // Note: In a real scenario, you'd add similar try/catch blocks for other characteristics.
            // For simplicity, we are focusing on heart rate here.
            
        } catch (error: any) {
            console.error('Bluetooth connection error:', error);
            if (error.name === 'NotFoundError') {
                 toast({ variant: 'destructive', title: 'Device Not Found', description: 'No devices found. Ensure your ESP32 is on and advertising.' });
            } else {
                 toast({ variant: 'destructive', title: 'Connection Failed', description: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleHeartRateChanged = (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return;

        // The Heart Rate Measurement characteristic format can be complex.
        // The first byte contains flags. If the least significant bit is 0, the heart rate is a UINT8.
        // If it's 1, it's a UINT16. This is a simplified parser.
        const heartRate = value.getUint8(1); 
        console.log('Heart Rate:', heartRate);
        onVitalsUpdate({ pulse: heartRate });
    };

    const onDisconnected = () => {
        setIsConnected(false);
        setDevice(null);
        toast({ title: 'Device Disconnected', description: 'The connection to the device was lost.' });
    };

    const handleDisconnect = () => {
        if (device && device.gatt) {
            device.gatt.disconnect();
        }
    };


    if (!isConnected) {
        return (
            <Button onClick={handleConnect} disabled={isLoading} variant="outline" size="sm">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bluetooth className="mr-2 h-4 w-4" />}
                Connect Device
            </Button>
        );
    }

    return (
        <Button onClick={handleDisconnect} variant="secondary" size="sm" title={`Connected to ${device?.name}`}>
            <BluetoothConnected className="mr-2 h-4 w-4 text-green-500" />
            Disconnect
        </Button>
    );
}
