
'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Image as ImageIcon, Scaling, HelpCircle, AspectRatio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [width, setWidth] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const { toast } = useToast();
  const originalAspectRatio = useRef<number>(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const inputFile = acceptedFiles[0];
    if (inputFile) {
      handleNewConversion();
      setFile(inputFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setOriginalUrl(url);
        const img = document.createElement('img');
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
          originalAspectRatio.current = img.width / img.height;
        };
        img.src = url;
      };
      reader.readAsDataURL(inputFile);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: `Please upload a valid image file.`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value === '' ? '' : Number(e.target.value);
    setWidth(newWidth);
    if (keepAspectRatio && newWidth !== '' && originalDimensions) {
      const newHeight = Math.round(Number(newWidth) / originalAspectRatio.current);
      setHeight(newHeight);
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value === '' ? '' : Number(e.target.value);
    setHeight(newHeight);
    if (keepAspectRatio && newHeight !== '' && originalDimensions) {
      const newWidth = Math.round(Number(newHeight) * originalAspectRatio.current);
      setWidth(newWidth);
    }
  };

  const handleResize = async () => {
    if (!file || !originalUrl || width === '' || height === '') return;

    setIsProcessing(true);
    setResizedUrl(null);

    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width);
      canvas.height = Number(height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, Number(width), Number(height));
        const dataUrl = canvas.toDataURL(file.type, 0.95);
        setResizedUrl(dataUrl);
        toast({
          title: 'Resize Successful',
          description: `Your image has been resized to ${width}x${height}.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Resize Failed',
          description: 'Could not get canvas context.',
        });
      }
      setIsProcessing(false);
    };
    img.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Resize Failed',
        description: 'Could not load image for resizing.',
      });
      setIsProcessing(false);
    };
    img.src = originalUrl;
  };

  const handleDownload = () => {
    if (!resizedUrl || !file) return;
    const link = document.createElement('a');
    link.href = resizedUrl;
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const extension = file.name.split('.').pop();
    link.download = `${originalName}-resized.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleNewConversion = () => {
    setFile(null);
    setOriginalUrl(null);
    setResizedUrl(null);
    setOriginalDimensions(null);
    setWidth('');
    setHeight('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Image Resizer</CardTitle>
          <CardDescription>
            Resize your JPG, PNG, or WEBP images quickly and easily.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Original Image</h3>
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                    {originalUrl && <NextImage src={originalUrl} alt="Original" fill objectFit="contain" />}
                  </div>
                  {originalDimensions && (
                    <p className="text-sm text-center text-muted-foreground">{originalDimensions.width} x {originalDimensions.height}px</p>
                  )}
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Resized Image</h3>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted/20 flex items-center justify-center">
                      {isProcessing && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                      {resizedUrl && <NextImage src={resizedUrl} alt="Resized" fill objectFit="contain" />}
                      {!resizedUrl && !isProcessing && <Scaling className="h-8 w-8 text-muted-foreground/50" />}
                    </div>
                    {resizedUrl && (
                      <p className="text-sm text-center text-muted-foreground">{width} x {height}px</p>
                    )}
                </div>
              </div>
              
              <div className="space-y-6 rounded-lg border p-6 bg-card/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" value={width} onChange={handleWidthChange} placeholder="e.g. 1920" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" value={height} onChange={handleHeightChange} placeholder="e.g. 1080" />
                    </div>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={setKeepAspectRatio} />
                    <Label htmlFor="aspect-ratio">Keep aspect ratio</Label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-center gap-4">
                {resizedUrl ? (
                  <>
                    <Button onClick={handleDownload} className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                     <Button variant="outline" onClick={handleNewConversion} className="w-full sm:w-auto">
                      Resize Another
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleResize} disabled={isProcessing} className="w-full sm:w-auto">
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : <Scaling className="mr-2 h-4 w-4" />}
                      {isProcessing ? 'Resizing...' : `Resize Image`}
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
          <h2 className="font-headline text-3xl font-bold tracking-tight">Your Simple, Free Online Image Resizer</h2>
          <p className="mt-4 text-lg text-muted-foreground">Need to resize an image for social media, your website, or an email? Our image resizer is a fast and easy tool to change the dimensions of your photos and graphics without compromising quality. Everything happens right in your browser, so your files are always secure.</p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>Frequently Asked Questions</span></h3>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">What image formats can I resize?</h4>
                <p className="text-muted-foreground mt-2">Our tool supports the most popular image formats on the web: JPG (or JPEG), PNG, and WEBP. You can upload any of these and resize them to your desired dimensions.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">Does resizing an image reduce its quality?</h4>
                <p className="text-muted-foreground mt-2">When you make an image smaller, the quality generally remains high. However, making an image much larger than its original size can lead to a loss in quality, causing it to look pixelated or blurry. For the best results, start with a high-resolution image.</p>
              </div>
        </div>
      </section>

    </div>
  );
}
