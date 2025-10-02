
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RotateCw, Trophy, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

const wheelColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#9e9e9e', '#607d8b'
];

const PickerWheel = ({ options, rotation, duration }: { options: string[], rotation: number, duration: number }) => {
  const segmentAngle = 360 / options.length;

  return (
    <div className="relative w-64 h-64 sm:w-96 sm:h-96 mx-auto rounded-full border-8 border-secondary shadow-2xl overflow-hidden">
      <div 
        className="absolute inset-0 rounded-full transition-transform ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: `${duration}ms`,
        }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
            style={{
              transform: `rotate(${index * segmentAngle}deg)`,
            }}
          >
            <div
              className="absolute -left-full w-full h-full origin-top-right"
              style={{
                transform: `skewX(${90 - segmentAngle}deg)`,
                backgroundColor: wheelColors[index % wheelColors.length],
              }}
            ></div>
            <div 
              className="absolute top-1/4 -left-full w-full h-1/2 text-white font-bold text-sm truncate"
              style={{ 
                transform: `translateX(-50%) translateY(-50%) rotate(${segmentAngle / 2}deg) skewX(-${90 - segmentAngle}deg) translateX(25%)`,
                writingMode: 'horizontal-tb',
                textAlign: 'right',
                paddingRight: '1rem',
              }}
            >
              <span className="block max-w-[80%] truncate">{option}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-background rounded-full border-4 border-secondary flex items-center justify-center">
        <div className="w-8 h-8 bg-primary rounded-full"></div>
      </div>
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-primary"
        style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}
      >
        <Trophy className="w-10 h-10 " />
      </div>
    </div>
  );
};


export default function PickerWheelPage() {
  const [options, setOptions] = useState('Apple\nBanana\nOrange\nGrape\nStrawberry\nMelon');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [spinDuration, setSpinDuration] = useState(0);
  
  // Prevent hydration errors by delaying rendering of the wheel until mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const optionList = useMemo(() => options.split('\n').filter(o => o.trim() !== ''), [options]);

  const handleSpin = () => {
    if (isSpinning || optionList.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    setSpinDuration(5000);

    const winnerIndex = Math.floor(Math.random() * optionList.length);
    const segmentAngle = 360 / optionList.length;
    
    // Add multiple full rotations + target angle
    const newRotation = rotation + (360 * 5) - (winnerIndex * segmentAngle) - (segmentAngle / 2);
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(optionList[winnerIndex]);
      setDialogOpen(true);
      // Reset rotation to a smaller equivalent angle to prevent it from growing infinitely
      setRotation(newRotation % 360);
      setSpinDuration(0);
    }, 5000);
  };
  
  const handleReset = () => {
    setRotation(0);
    setSpinDuration(0);
    setWinner(null);
    setIsSpinning(false);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Random Picker Wheel</CardTitle>
          <CardDescription>
            Enter your options below (one per line) and spin the wheel to pick a winner!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div>
                <Label htmlFor="options">Options</Label>
                <Textarea
                  id="options"
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                  rows={10}
                  placeholder="Enter each option on a new line"
                  disabled={isSpinning}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSpin} disabled={isSpinning || optionList.length < 2} className="w-full">
                  <RotateCw className={cn('mr-2 h-4 w-4', { 'animate-spin': isSpinning })} />
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isSpinning}>
                  Reset
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[256px] sm:min-h-[384px]">
             {isMounted && <PickerWheel options={optionList} rotation={rotation} duration={spinDuration}/>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-12" />

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">The Ultimate Random Name Picker</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Can't decide? Let fate take the wheel! Our Picker Wheel is a free and fun online tool that helps you make random choices in an exciting way. Whether you're running a giveaway, choosing a name for a contest, or just trying to decide where to eat for lunch, our wheel has you covered.
          </p>
        </div>
        
        <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><HelpCircle className="text-primary"/><span>How to Use the Picker Wheel</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="font-bold text-primary text-4xl mb-2">1</div>
                <h4 className="font-semibold">Enter Names</h4>
                <p className="text-sm text-muted-foreground">Type or paste the list of names or choices into the text box, with each option on a new line.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="font-bold text-primary text-4xl mb-2">2</div>
                <h4 className="font-semibold">Spin the Wheel</h4>
                <p className="text-sm text-muted-foreground">Click the "Spin the Wheel" button to start the random selection process with an engaging animation.</p>
              </div>
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="font-bold text-primary text-4xl mb-2">3</div>
                <h4 className="font-semibold">Get a Winner</h4>
                <p className="text-sm text-muted-foreground">The wheel will stop on a random choice, which is then announced as the winner. It's that simple!</p>
              </div>
            </div>
        </div>

        <div className="rounded-lg border bg-card/50 p-6 text-center">
            <h3 className="font-headline text-2xl font-bold">Perfect for Any Occasion</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Use it for contests, classroom activities, giveaways, brainstorming sessions, or any time you need a fair and random choice. It's a versatile tool for teachers, marketers, and anyone looking to add a bit of fun to their decision-making process.</p>
        </div>
      </section>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
            <AlertDialogTitle className="text-3xl font-bold">The Winner Is...</AlertDialogTitle>
            <AlertDialogDescription className="text-4xl text-primary font-headline py-4">
              {winner}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
