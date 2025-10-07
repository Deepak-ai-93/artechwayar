
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePalette } from 'color-thief-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image as ImageIcon, Copy, HelpCircle, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ColorBox = ({ color }: { color: string }) => {
    const { toast } = useToast();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(color);
        toast({
            title: 'Copied!',
            description: `${color} copied to clipboard.`,
        });
    };

    return (
        <div 
            className="relative w-full aspect-square rounded-md cursor-pointer group"
            style={{ backgroundColor: color }}
            onClick={copyToClipboard}
        >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Copy className="w-6 h-6 text-white" />
            </div>
            <p className="absolute bottom-1 left-1 text-xs font-mono bg-black/40 text-white/90 px-1 rounded-sm">{color}</p>
        </div>
    );
};


export default function ColorPickerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const inputFile = acceptedFiles[0];
    if (inputFile && inputFile.type.startsWith('image/')) {
      handleNew();
      setFile(inputFile);
      setImageUrl(URL.createObjectURL(inputFile));
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file.',
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    multiple: false,
  });

  const { data: palette, loading, error } = usePalette(imageUrl, 8, 'hex', {
    crossOrigin: 'anonymous',
    quality: 10,
  });

  if (error) {
    console.error(error);
    toast({
        title: 'Error processing image',
        description: 'Could not extract colors. The image might be corrupted or in an unsupported format.',
        variant: 'destructive'
    });
  }

  const handleNew = () => {
    setFile(null);
    setImageUrl(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Image Color Picker</CardTitle>
          <CardDescription>
            Upload an image to extract a beautiful color palette.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Your Image</h3>
                         <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                            <NextImage src={imageUrl} alt="Uploaded" fill objectFit="contain" />
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Extracted Palette</h3>
                        <div className={cn("relative w-full aspect-video rounded-md border bg-muted/20 flex items-center justify-center p-4", {
                            'grid grid-cols-4 gap-4': palette && !loading
                        })}>
                          {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                          {!loading && !palette && <Droplet className="h-8 w-8 text-muted-foreground/50" />}
                          {palette && palette.map((color, i) => (
                              <ColorBox key={`${color}-${i}`} color={color} />
                          ))}
                        </div>
                    </div>
                </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={handleNew}>
                    Extract from another image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

       <Separator className="my-12" />

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Generate a Color Palette from Any Image</h2>
          <p className="mt-4 text-lg text-muted-foreground">Our free Image Color Picker helps you discover the perfect color scheme. Simply upload any image, and our tool will automatically analyze it to extract the most prominent colors. It's the perfect utility for designers, artists, and developers looking for color inspiration.</p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>Frequently Asked Questions</span></h3>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">How does the color extraction work?</h4>
                <p className="text-muted-foreground mt-2">The tool uses an algorithm to analyze the pixels of your uploaded image and identify the most dominant colors. It then groups similar colors to generate a representative palette. All of this happens instantly in your browser.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">Is this tool free to use?</h4>
                <p className="text-muted-foreground mt-2">Yes, our Image Color Picker is completely free to use. Your images are processed on your device and are never uploaded to our servers, so your data remains private and secure.</p>
              </div>
        </div>
      </section>

    </div>
  );
}

