'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CheckCircle, HelpCircle, Info, Loader2, RefreshCw, Send, Trash2, XCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db, storage, auth } from '@/lib/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import axios from 'axios';

const WasteMap = dynamic(() => import('./waste-map'), { ssr: false });

// Define the output structure based on your needs.
type WasteAnalysisResult = {
  isWaste: boolean;
  wasteType: 'Organic' | 'Recyclable' | 'Hazardous' | 'E-waste' | 'Other' | 'Not Waste';
  disposalInstructions: string;
  recyclingInfo?: string;
};

const disposalCenters = [
    { name: 'Greenfield Recycling Center', lat: 28.61, lng: 77.23, type: 'Recyclable' },
    { name: 'Eco Scrap Traders', lat: 28.62, lng: 77.21, type: 'Recyclable' },
    { name: 'Central Waste Facility', lat: 28.59, lng: 77.22, type: 'Hazardous' },
    { name: 'Southside Compost Hub', lat: 28.60, lng: 77.25, type: 'Organic' },
];


export default function ScanWastePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
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
  
  async function getDisposalInstructions(wasteType: string): Promise<{ instruction: string; recyclingInfo?: string }> {
      if (!wasteType || wasteType === 'Not Waste') {
          return { instruction: "This item does not appear to be waste." };
      }
      try {
          const docRef = doc(db, "disposal-instructions", wasteType.toLowerCase());
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              const data = docSnap.data();
              return {
                  instruction: data.instruction || `No specific instruction for ${wasteType}.`,
                  recyclingInfo: data.recyclingInfo,
              };
          } else {
              return { instruction: `No disposal instructions found for ${wasteType}.` };
          }
      } catch (error) {
          console.error("Error fetching instructions: ", error);
          return { instruction: "Could not retrieve disposal instructions at this time." };
      }
  }

  // Helper to convert data URI to Blob
  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  const analyzeImage = async () => {
    if (!capturedImage) {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'No image to analyze.',
        });
        return;
    };
    setLoading(true);
    setResult(null);
    
    try {
        // 1. Send image to backend for classification
        const formData = new FormData();
        const imageBlob = dataURItoBlob(capturedImage);
        formData.append('image', imageBlob, 'waste-image.jpg');

        // IMPORTANT: Replace with your actual backend endpoint
        const predictionEndpoint = 'https://your-backend-domain/predict';
        const response = await axios.post(predictionEndpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        const wasteType = response.data.type as WasteAnalysisResult['wasteType'];

        // 2. Fetch disposal instructions from Firestore
        const { instruction, recyclingInfo } = await getDisposalInstructions(wasteType);

        const analysisResult: WasteAnalysisResult = {
            isWaste: wasteType !== 'Not Waste',
            wasteType: wasteType,
            disposalInstructions: instruction,
            recyclingInfo: recyclingInfo,
        };
        setResult(analysisResult);

      // 3. Upload the image to Firebase Storage
      const imageId = uuidv4();
      const storageRef = ref(storage, `waste-images/${imageId}.jpg`);
      await uploadString(storageRef, capturedImage, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Store the analysis and metadata in Firestore
      await addDoc(collection(db, "waste-analysis"), {
        ...analysisResult,
        imageUrl: downloadURL,
        createdAt: new Date(),
        userId: userId,
      });

      toast({
        title: 'Analysis Complete',
        description: 'Image and analysis have been saved.',
      });

    } catch (error) {
      console.error('Error identifying or saving waste:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis or Storage Failed',
        description: 'Could not analyze the image. Please ensure the backend service is running and accessible.',
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

  const relevantCenters = result ? disposalCenters.filter(center => center.type === result.wasteType) : [];

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
                <img ref={imageRef} src={capturedImage} alt="Captured waste" className="h-full w-full object-contain" />
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

        {result && (
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'>
                        <ResultIcon className='h-8 w-8 text-primary' />
                        Analysis Result: {result.isWaste ? result.wasteType : "Not Waste"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    {relevantCenters.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Nearby Disposal Centers</h3>
                            <WasteMap centers={relevantCenters} />
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
