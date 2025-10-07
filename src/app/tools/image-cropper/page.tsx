
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Image as ImageIcon, Crop, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { Separator } from '@/components/ui/separator';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = (rotation * Math.PI) / 180;

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(1, 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = (rotation * Math.PI) / 180;

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const inputFile = acceptedFiles[0];
    if (inputFile) {
      handleNewConversion();
      setFile(inputFile);
      setImageUrl(URL.createObjectURL(inputFile));
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (JPG, PNG, WEBP).',
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageUrl || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      setCroppedImageUrl(croppedImage);
      toast({
        title: 'Crop Successful',
        description: 'Your image has been cropped.',
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Crop Failed',
        description: 'An error occurred while cropping the image.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl, croppedAreaPixels, toast]);

  const handleDownload = () => {
    if (!croppedImageUrl || !file) return;
    const link = document.createElement('a');
    link.href = croppedImageUrl;
    const originalName = file.name.split('.').slice(0, -1).join('.');
    link.download = `${originalName}-cropped.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleNewConversion = () => {
    setFile(null);
    setImageUrl(null);
    setCroppedImageUrl(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Image Cropper</CardTitle>
          <CardDescription>
            Upload an image and crop it to your desired dimensions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!imageUrl ? (
            <div
              {...getRootProps()}
              className={`flex justify-center items-center flex-col w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Drag & drop an image here, or click to select a file
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
                <div className="relative h-96 w-full bg-muted/20 rounded-lg">
                    {croppedImageUrl ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <NextImage src={croppedImageUrl} alt="Cropped" width={500} height={400} objectFit="contain" />
                        </div>
                    ) : (
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    )}
                </div>

              <div className="flex flex-col-reverse sm:flex-row justify-center gap-4">
                {croppedImageUrl ? (
                  <>
                    <Button onClick={handleDownload} className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                     <Button variant="outline" onClick={handleNewConversion} className="w-full sm:w-auto">
                      Crop Another
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={showCroppedImage} disabled={isProcessing} className="w-full sm:w-auto">
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : <Crop className="mr-2 h-4 w-4" />}
                      {isProcessing ? 'Cropping...' : `Crop Image`}
                    </Button>
                     <Button variant="outline" onClick={handleNewConversion} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

       <Separator className="my-12" />

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Your Free Online Image Cropper</h2>
          <p className="mt-4 text-lg text-muted-foreground">Perfectly frame your photos with our easy-to-use image cropper. Whether you're preparing images for social media profiles, web banners, or presentations, our tool lets you select and crop the exact part of the image you need. It's fast, free, and secure, with all processing done in your browser.</p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>Frequently Asked Questions</span></h3>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">How do I crop an image?</h4>
                <p className="text-muted-foreground mt-2">Simply upload your image, and a cropping rectangle will appear. You can drag and resize this rectangle to select the area you want to keep. Once you're happy with your selection, click the "Crop Image" button to see the result.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">Are my images uploaded to a server?</h4>
                <p className="text-muted-foreground mt-2">No. Our image cropper is a browser-based tool. Your images are processed directly on your computer and are never uploaded to our servers, ensuring your privacy and security.</p>
              </div>
        </div>
      </section>

    </div>
  );
}
