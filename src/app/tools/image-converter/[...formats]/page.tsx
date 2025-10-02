
// src/app/tools/image-converter/[...formats]/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Image as ImageIcon, FileCheck2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const formatMap: Record<string, { mime: string; label: string; extensions: string[] }> = {
  png: { mime: 'image/png', label: 'PNG', extensions: ['.png'] },
  jpg: { mime: 'image/jpeg', label: 'JPG', extensions: ['.jpg', '.jpeg'] },
  jpeg: { mime: 'image/jpeg', label: 'JPG', extensions: ['.jpg', '.jpeg'] },
  webp: { mime: 'image/webp', label: 'WEBP', extensions: ['.webp'] },
  heic: { mime: 'image/heic', label: 'HEIC', extensions: ['.heic'] },
  jfif: { mime: 'image/jpeg', label: 'JFIF', extensions: ['.jfif', '.jpg', '.jpeg'] },
};

const seoContent: Record<string, { title: string; text: string; faqs: {q: string, a: string}[] }> = {
  'png-to-jpg': {
    title: 'Your Free Online PNG to JPG Converter',
    text: 'Our PNG to JPG converter is a free online tool that lets you change your images from PNG to JPG format in seconds. This is incredibly useful for optimizing images for the web, as JPG files are often smaller than PNGs, leading to faster page load times. Converting is simple: just upload your PNG, and we’ll provide a high-quality JPG file for you to download instantly. No software, no watermarks, no limits.',
    faqs: [
      { q: 'Why convert from PNG to JPG?', a: 'Converting from PNG to JPG can significantly reduce file size, which is ideal for web use. JPGs use lossy compression, making them smaller and faster to load on websites, while still maintaining great quality for photographs and complex images.'},
      { q: 'Will I lose image quality?', a: 'JPG is a lossy format, so there is a slight quality reduction, but our tool uses a high-quality setting (95%) to ensure the difference is virtually unnoticeable for most uses while still providing a much smaller file.'},
      { q: 'Does this tool handle transparency?', a: 'JPG does not support transparency. When you convert a transparent PNG to JPG, the transparent areas will be filled with a solid white background by default.'},
    ],
  },
  'webp-to-png': {
    title: 'Seamless WEBP to PNG Conversion',
    text: 'WEBP is a modern format with great compression, but it\'s not universally supported. Our WEBP to PNG converter allows you to change your WEBP images into the widely compatible PNG format. PNG is a lossless format, meaning it preserves all image data, including transparency. This is perfect for graphics, logos, and images where quality and transparency are essential.',
    faqs: [
        { q: 'Why convert from WEBP to PNG?', a: 'While WEBP is efficient, PNG offers broader compatibility across older devices, software, and platforms. Converting to PNG ensures your image can be viewed and edited almost anywhere, and it fully supports transparency.'},
        { q: 'Is the conversion lossless?', a: 'Yes. Both WEBP (in its lossless mode) and PNG are lossless formats. Our tool ensures that when you convert from WEBP to PNG, all the original image quality and data, including transparency, are perfectly preserved.'},
    ]
  },
  'heic-to-jpg': {
    title: 'Convert iPhone Photos (HEIC) to JPG for Free',
    text: 'Apple uses the HEIC (High-Efficiency Image Container) format for photos on iPhones and iPads because it saves space. However, HEIC isn\'t compatible with many apps and devices, especially outside the Apple ecosystem. Our HEIC to JPG converter makes your photos universal. Convert your .heic files to the standard JPG format to easily share, edit, and view them on any platform.',
    faqs: [
        { q: 'What is a HEIC file?', a: 'HEIC is an image format that Apple uses to store photos. It uses advanced compression to save images at a high quality but with a smaller file size compared to JPG.'},
        { q: 'Why do I need to convert HEIC to JPG?', a: 'You need to convert HEIC to JPG to ensure your photos can be viewed on non-Apple devices, like Windows PCs and Android phones, or used in software that doesn\'t support the HEIC format.'},
    ]
  }
};


export default function ImageConverterPage() {
  const params = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const { slug, fromFormat, toFormat, fromMime, toMime, fromLabel, toLabel, fromExtensions } = useMemo(() => {
    const currentSlug = (params.formats as string[])?.[0] || '';
    const parts = currentSlug.split('-to-');
    if (parts.length !== 2) {
      return { slug: null, fromFormat: null, toFormat: null };
    }
    
    const [from, to] = parts;
    const fromData = formatMap[from];
    const toData = formatMap[to];

    if (!fromData || !toData) {
      return { slug: null, fromFormat: null, toFormat: null };
    }

    return {
      slug: currentSlug,
      fromFormat: from,
      toFormat: to,
      fromMime: fromData.mime,
      toMime: toData.mime as 'image/jpeg' | 'image/png' | 'image/webp',
      fromLabel: fromData.label,
      toLabel: toData.label,
      fromExtensions: fromData.extensions,
    };
  }, [params]);
  
  const currentSeoContent = useMemo(() => {
    return seoContent[slug as string] || 
           seoContent[Object.keys(seoContent).find(k => slug?.includes(k.split('-to-')[0])) || ''] ||
           { title: `Your Free Online ${fromLabel} to ${toLabel} Converter`, text: `Convert your images from ${fromLabel} to ${toLabel} for free.`, faqs: [] };
  }, [slug, fromLabel, toLabel]);


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
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (toMime === 'image/jpeg') {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL(toMime, 0.95);
          setConvertedFile(dataUrl);
          toast({
            title: 'Conversion Successful',
            description: `Your image has been converted to ${toLabel}.`,
          });
        } else {
           toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: 'Could not get canvas context.',
          });
        }
        setIsConverting(false);
      };
      img.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: 'Could not load image for conversion.',
        });
        setIsConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
       toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: 'Failed to read the input file.',
      });
      setIsConverting(false);
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
                <Image src={convertedFile} alt="Converted image" fill objectFit="contain" />
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

      <Separator className="my-12" />

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">{currentSeoContent.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{currentSeoContent.text}</p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>Frequently Asked Questions</span></h3>
            {currentSeoContent.faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">{faq.q}</h4>
                <p className="text-muted-foreground mt-2">{faq.a}</p>
              </div>
            ))}
        </div>

        <div className="rounded-lg border bg-card/50 p-6 text-center">
            <h3 className="font-headline text-2xl font-bold">Fast, Free, and Secure</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">All conversions happen directly in your browser. Your files are never uploaded to our servers, ensuring your data remains private and secure. Enjoy unlimited conversions with no watermarks.</p>
        </div>
      </section>

    </div>
  );
}
