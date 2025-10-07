'use client';

import { Bot, Code, Paintbrush, BrainCircuit, Lightbulb, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [
    { component: Bot, className: "top-1/4 left-1/4" },
    { component: Code, className: "top-1/2 right-1/4", animationDelay: '1s' },
    { component: Paintbrush, className: "bottom-1/4 right-1/3", animationDelay: '2s' },
    { component: BrainCircuit, className: "top-1/3 right-1/2", animationDelay: '3s' },
    { component: Lightbulb, className: "bottom-1/3 left-1/3", animationDelay: '4s' },
    { component: Wand2, className: "bottom-1/2 left-1/2", animationDelay: '5s' },
];

export function FloatingIcons() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {icons.map((icon, index) => {
                const IconComponent = icon.component;
                return (
                    <div
                        key={index}
                        className={cn(
                            "absolute text-primary/10 animate-float",
                            icon.className
                        )}
                        style={{ animationDelay: icon.animationDelay }}
                    >
                        <IconComponent className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                );
            })}
        </div>
    );
}
