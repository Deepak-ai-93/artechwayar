
// src/app/tools/image-converter/[...formats]/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { convertImage } from '@/lib/actions';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const formatMap: Record<string, { mime: string; label: string; extensions: string[] }> = {
  png: { mime: 'image/png', label: 'PNG', extensions: ['.png'] },
  jpg: { mime: 'image/jpeg', label: 'JPG', extensions: ['.jpg', '.jpeg'] },
  jpeg: { mime: 'image/jpeg', label: 'JPG', extensions: ['.jpg', '.jpeg'] },
  webp: { mime: 'image/webp', label: 'WEBP', extensions: ['.webp'] },
  heic: { mime: 'image/heic', label: 'HEIC', extensions: ['.heic'] },
  jfif: { mime: 'image/jpeg', label: 'JFIF', extensions: ['.jfif', '.jpg', '.jpeg'] },
};

export default function ImageConverterPage({ params }: { params: { formats: string[] } }) {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const { fromFormat, toFormat, fromMime, toMime, fromLabel, toLabel, fromExtensions } = useMemo(() => {
    const slug = params.formats?.[0] || '';
    const parts = slug.split('-to-');
    if (parts.length !== 2) {
      return { fromFormat: null, toFormat: null };
    }
    
    const [from, to] = parts;
    const fromData = formatMap[from];
    const toData = formatMap[to];

    if (!fromData || !toData) {
      return { fromFormat: null, toFormat: null };
    }

    return {
      fromFormat: from,
      toFormat: to,
      fromMime: fromData.mime,
      toMime: toData.mime as 'image/jpeg' | 'image/png' | 'image/webp',
      fromLabel: fromData.label,
      toLabel: toData.label,
      fromExtensions: fromData.extensions,
    };
  }, [params.formats]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const inputFile = acceptedFiles[0];
    if (inputFile) {
      setFile(inputFile);
      setConvertedFile(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: `Please upload a ${fromLabel} file.`,
      });
    }
  }, [toast, fromLabel]);
  
  const accept = useMemo(() => ({ [fromMime as string]: fromExtensions as string[] }), [fromMime, fromExtensions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fromMime ? accept : undefined,
    multiple: false,
  });

  if (!fromFormat || !toFormat || !fromMime || !toMime) {
    notFound();
  }


  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setConvertedFile(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await convertImage(base64, toMime);
        if (result.imageUrl) {
          setConvertedFile(result.imageUrl);
          toast({
            title: 'Conversion Successful',
            description: `Your image has been converted to ${toLabel}.`,
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
    const originalName = file?.name.split('.').slice(0, -1).join('.');
    link.download = `${originalName}.${toFormat}`;
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
          <CardTitle className="font-headline text-3xl">{fromLabel} to {toLabel} Converter</CardTitle>
          <CardDescription>
            Quickly convert your {fromLabel} images to {toLabel} format.
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
                        Drag & drop a {fromLabel} file here, or click to select a file
                      </p>
                       <p className="text-xs text-muted-foreground mt-1">
                        (Only {fromExtensions?.join(', ')} files are accepted)
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
                    {isConverting ? 'Converting...' : `Convert to ${toLabel}`}
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
                  Download {toLabel}
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
