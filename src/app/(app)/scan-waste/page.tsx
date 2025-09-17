'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CheckCircle, HelpCircle, Info, Loader2, RefreshCw, Send, Trash2, XCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyWaste, type IdentifyWasteOutput } from '@/ai/flows/identify-waste';

export default function ScanWastePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyWasteOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
         setHasCameraPermission(false);
         return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    if (!capturedImage) {
        getCameraPermission();
    }

     return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage, toast]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await identifyWaste({ photoDataUri: capturedImage });
      setResult(response);
    } catch (error) {
      console.error('Error identifying waste:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
      });
    }
    setLoading(false);
  };
  
  const getResultIcon = () => {
    if (!result) return HelpCircle;
    if (!result.isWaste) return HelpCircle;

    switch (result.wasteType) {
        case 'Organic':
        return Trash2;
        case 'Recyclable':
        return CheckCircle;
        case 'Hazardous':
        return XCircle;
        default:
        return Info;
    }
  }
  
  const ResultIcon = getResultIcon();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Scan Waste"
        description="Point your camera at an item to identify its waste type."
      />

      <Card className="mx-auto max-w-2xl">
        <CardContent className='p-6'>
          <div className='relative aspect-video w-full overflow-hidden rounded-md bg-secondary'>
            {!hasCameraPermission && !capturedImage && (
                <div className='flex flex-col items-center justify-center h-full text-center'>
                    <Camera className='h-12 w-12 text-muted-foreground' />
                    <p className='mt-4 text-muted-foreground'>Camera access is required to scan waste.</p>
                </div>
            )}

            {capturedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={capturedImage} alt="Captured waste" className="h-full w-full object-contain" />
            ) : (
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

           { !hasCameraPermission && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings to use this feature. You might need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
            )}
        </CardContent>
        <CardFooter className='flex justify-center gap-4'>
            {capturedImage ? (
                <>
                    <Button variant="outline" onClick={retakeImage} disabled={loading}>
                        <RefreshCw className='mr-2' /> Retake
                    </Button>
                    <Button onClick={analyzeImage} disabled={loading}>
                        {loading ? (
                            <><Loader2 className='mr-2 animate-spin' /> Analyzing...</>
                        ) : (
                            <><Send className='mr-2' /> Analyze Picture</>
                        )}
                    </Button>
                </>
            ) : (
                <Button onClick={captureImage} disabled={!hasCameraPermission}>
                    <Camera className='mr-2' /> Capture Image
                </Button>
            )}
        </CardFooter>
      </Card>

        {result && (
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'>
                        <ResultIcon className='h-8 w-8 text-primary' />
                        Analysis Result: {result.isWaste ? result.wasteType : "Not Waste"}
                    </CardTitle>
                    <CardDescription>
                        Here is the AI's analysis of your item.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Disposal Instructions</h3>
                        <p className="text-muted-foreground">{result.disposalInstructions}</p>
                    </div>
                    {result.recyclingInfo && (
                         <div className="space-y-1">
                            <h3 className="font-semibold">Recycling Information</h3>
                            <p className="text-muted-foreground">{result.recyclingInfo}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
