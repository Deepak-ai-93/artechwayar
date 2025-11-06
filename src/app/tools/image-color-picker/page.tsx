
'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Image as ImageIcon, Copy, Check, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function ImageColorPickerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<{ hex: string; rgb: string } | null>(null);
  const [pickedColors, setPickedColors] = useState<{ hex: string; rgb: string }[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const inputFile = acceptedFiles[0];
    if (inputFile && inputFile.type.startsWith('image/')) {
      handleNew();
      setFile(inputFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
          }
        };
        img.src = url;
      };
      reader.readAsDataURL(inputFile);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    
    setHoverColor({
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
    });
  };

  const handleCanvasClick = () => {
    if (hoverColor) {
      if (pickedColors.length < 12 && !pickedColors.some(c => c.hex === hoverColor.hex)) {
        setPickedColors(prev => [...prev, hoverColor]);
      } else if (pickedColors.length >= 12) {
        toast({
          variant: 'destructive',
          title: 'Palette Full',
          description: 'You can save up to 12 colors.',
        });
      }
    }
  };

  const handleCopy = (color: string) => {
    copyToClipboard(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
    toast({
      title: 'Copied to Clipboard',
      description: `Color ${color} copied.`,
    });
  };

  const handleNew = () => {
    setFile(null);
    setImageUrl(null);
    setHoverColor(null);
    setPickedColors([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Image Color Picker</CardTitle>
          <CardDescription>
            Upload an image to pick colors and create your perfect palette.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!imageUrl ? (
            <div
              {...getRootProps()}
              className={`flex justify-center items-center flex-col w-full h-80 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Drag & drop an image here, or click to select a file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (JPG, PNG, WEBP supported)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto object-contain cursor-crosshair rounded-md border"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverColor(null)}
                  onClick={handleCanvasClick}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Color Preview</h3>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div
                      className="h-16 w-16 rounded-md border"
                      style={{ backgroundColor: hoverColor?.hex || 'transparent' }}
                    />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{hoverColor?.hex || '#...'}</p>
                      <p className="text-muted-foreground">{hoverColor?.rgb || 'rgb(...)'}</p>
                    </div>
                  </div>
                   <p className="text-xs text-muted-foreground mt-2">Hover over the image to see colors. Click to save.</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Picked Colors ({pickedColors.length}/12)</h3>
                    {pickedColors.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {pickedColors.map((color, i) => (
                          <div key={i} className="group relative flex items-center gap-2 p-2 border rounded-md bg-card">
                            <div
                              className="h-8 w-8 rounded-md border flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="text-xs truncate">
                              <p className="font-bold">{color.hex}</p>
                              <p className="text-muted-foreground">{color.rgb}</p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(color.hex)}>
                                    {copiedColor === color.hex ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-destructive/80" onClick={() => setPickedColors(p => p.filter(c => c.hex !== color.hex))}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-center h-24 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">Your color palette is empty.</p>
                      </div>
                    )}
                </div>

                <Button onClick={handleNew} className="w-full">Upload New Image</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Separator className="my-12" />

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Your Ultimate Image Color Finder</h2>
          <p className="mt-4 text-lg text-muted-foreground">Ever see a color in an image and wish you knew exactly what it was? Our Image Color Picker is a free online tool that lets you upload any image and instantly identify any color within it. Get HEX, RGB, and HSL codes with a simple hover and click. It's the perfect companion for designers, developers, and artists.</p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>Frequently Asked Questions</span></h3>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">How do I pick a color from an image?</h4>
                <p className="text-muted-foreground mt-2">Simply upload your image. Then, move your mouse cursor over the image. The color preview will update in real-time. To save a color to your palette, just click on the desired spot in the image.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">Is this tool free to use?</h4>
                <p className="text-muted-foreground mt-2">Yes, our Image Color Picker is completely free to use. All processing happens in your browser, meaning your images are never uploaded to our servers, ensuring your privacy and security.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <h4 className="font-semibold text-primary">What color formats can I get?</h4>
                <p className="text-muted-foreground mt-2">Our tool provides the most common color codes used in web design and development: HEX and RGB. You can easily copy these codes to your clipboard with a single click from your saved palette.</p>
              </div>
        </div>
      </section>

    </div>
  );
}
