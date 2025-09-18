'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CheckCircle, HelpCircle, Info, Loader2, RefreshCw, Send, Trash2, XCircle, Clock } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db, storage, auth } from '@/lib/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { identifyWaste, IdentifyWasteOutput } from '@/ai/flows/identify-waste';


const WasteMap = dynamic(() => import('./waste-map'), { ssr: false });

const disposalCenters = [
    { name: 'Greenfield Recycling Center', lat: 28.61, lng: 77.23, type: 'Recyclable' },
    { name: 'Eco Scrap Traders', lat: 28.62, lng: 77.21, type: 'Recyclable' },
    { name: 'Central Waste Facility', lat: 28.59, lng: 77.22, type: 'Hazardous' },
    { name: 'Southside Compost Hub', lat: 28.60, lng: 77.25, type: 'Organic' },
    { name: 'E-Waste Collectors', lat: 28.63, lng: 77.24, type: 'E-waste' },
];


export default function ScanWastePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyWasteOutput | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
      // 1. Analyze the image with the Genkit AI flow
      const analysisResult = await identifyWaste({ photoDataUri: capturedImage });
      setResult(analysisResult);

      // 2. Upload the image to Firebase Storage
      const imageId = uuidv4();
      const storageRef = ref(storage, `waste-images/${imageId}.jpg`);
      await uploadString(storageRef, capturedImage, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      // 3. Store the analysis and metadata in Firestore
      if (userId) {
        await addDoc(collection(db, "waste-analysis"), {
          ...analysisResult,
          imageUrl: downloadURL,
          createdAt: new Date(),
          userId: userId,
        });
      }

      toast({
        title: 'Analysis Complete',
        description: `Waste identified as: ${analysisResult.wasteType}`,
      });

    } catch (error) {
      console.error('Error identifying or saving waste:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. The AI service may be unavailable.',
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
        case 'Electronics':
        case 'E-waste':
        return XCircle;
        default:
        return Info;
    }
  }
  
  const ResultIcon = getResultIcon();

  const getRelevantCenters = () => {
    if (!result || !result.isWaste) return [];
    
    const nonBiodegradableTypes: (typeof result.wasteType)[] = ['Recyclable', 'E-waste', 'Electronics', 'Hazardous'];
    
    if (nonBiodegradableTypes.includes(result.wasteType)) {
      // Show all recycling, e-waste, and hazardous centers
      return disposalCenters.filter(center => 
        center.type === 'Recyclable' || 
        center.type === 'E-waste' || 
        center.type === 'Hazardous'
      );
    }
    
    // For Organic and other biodegradable types
    return disposalCenters.filter(center => center.type === result.wasteType);
  }

  const relevantCenters = getRelevantCenters();

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
                    <Button onClick={analyzeImage} disabled={loading || !userId}>
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

      <div className={!result ? 'hidden' : ''}>
        {result && (
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'>
                        <ResultIcon className='h-8 w-8 text-primary' />
                        Analysis Result: {result.isWaste ? result.wasteType : "Not Waste"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {result.decompositionTime && (
                         <div className="space-y-1">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Clock className='h-5 w-5' />
                                Estimated Decomposition Time
                            </h3>
                            <p className="text-muted-foreground pl-7">{result.decompositionTime}</p>
                        </div>
                    )}
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
                    <div className={relevantCenters.length > 0 ? 'space-y-4' : 'hidden'}>
                        <h3 className="font-semibold">Nearby Disposal Centers</h3>
                        <WasteMap />
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
