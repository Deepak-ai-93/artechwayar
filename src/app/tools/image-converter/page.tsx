// src/app/tools/image-converter/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { convertImage } from '@/lib/actions';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function PngToJpgConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pngFile = acceptedFiles.find(f => f.type === 'image/png');
    if (pngFile) {
      setFile(pngFile);
      setConvertedFile(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PNG file.',
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setConvertedFile(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await convertImage(base64, 'image/jpeg');
        if (result.imageUrl) {
          setConvertedFile(result.imageUrl);
          toast({
            title: 'Conversion Successful',
            description: 'Your image has been converted to JPG.',
          });
        } else {
          throw new Error(result.error || 'Unknown conversion error');
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: error.message,
        });
      } finally {
        setIsConverting(false);
      }
    };
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    const link = document.createElement('a');
    link.href = convertedFile;
    const originalName = file?.name.replace(/\.png$/, '');
    link.download = `${originalName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleNewConversion = () => {
    setFile(null);
    setConvertedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">PNG to JPG Converter</CardTitle>
          <CardDescription>
            Quickly convert your PNG images to JPG format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!convertedFile ? (
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`flex justify-center items-center flex-col w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="mt-2 text-primary">Drop the file here...</p>
                  ) : (
                    <>
                      <p className="mt-2 text-muted-foreground">
                        Drag & drop a PNG file here, or click to select a file
                      </p>
                       <p className="text-xs text-muted-foreground mt-1">
                        (Only .png files are accepted)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {file && (
                <div className="text-center space-y-4">
                  <p className="font-medium">Selected file: {file.name}</p>
                  <Button onClick={handleConvert} disabled={isConverting}>
                    {isConverting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isConverting ? 'Converting...' : 'Convert to JPG'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
               <div className="relative w-full max-w-md mx-auto aspect-video rounded-md overflow-hidden border">
                <Image src={convertedFile} alt="Converted image" layout="fill" objectFit="contain" />
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download JPG
                </Button>
                <Button variant="outline" onClick={handleNewConversion}>
                  Convert Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
