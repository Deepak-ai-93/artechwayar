// Inspired by: https://codepen.io/finnhvman/pen/jLXGaj
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function HeroAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto flex h-[400px] w-[400px] items-center justify-center", className)}>
      <style jsx>{`
        .sphere-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 58.1em;
          height: 58.1em;
          margin: -29.05em;
        }
        .sphere-animation .sphere {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10em;
          height: 10em;
          margin: -5em;
          border-radius: 50%;
          box-shadow: 0 0 0.5em 0 hsl(var(--primary) / 0.4), 0 0 0.5em 0 hsl(var(--primary) / 0.3) inset;
          background: hsl(var(--background) / 0.1);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          border: 1px solid hsl(var(--primary) / 0.2);
        }
        .sphere-animation .sphere .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1em;
          height: 1em;
          margin: -0.5em;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.8);
          box-shadow: 0 0 2em 0.3em hsl(var(--primary));
        }
        .sphere-animation .sphere .dot:nth-child(1) {
          -webkit-animation: A_1 4s -0.5s infinite;
          animation: A_1 4s -0.5s infinite;
        }
        .sphere-animation .sphere .dot:nth-child(2) {
          -webkit-animation: A_1 4s -2.5s infinite;
          animation: A_1 4s -2.5s infinite;
        }
        .sphere-animation .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 15em;
          height: 15em;
          margin: -7.5em;
          -webkit-animation: A_2 4s_ease-in-out_infinite;
          animation: A_2 4s ease-in-out infinite;
          border-radius: 50%;
          border: 1px solid hsl(var(--primary) / 0.4);
        }
        .sphere-animation .orbit .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1.2em;
          height: 1.2em;
          margin: -0.6em;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 1em 0 hsl(var(--primary));
          -webkit-animation: A_3 4s ease-in-out infinite;
          animation: A_3 4s ease-in-out infinite;
        }
        .sphere-animation .orbit:nth-child(2) {
          width: 25em;
          height: 25em;
          margin: -12.5em;
          -webkit-animation-name: A_4;
          animation-name: A_4;
          border-width: 1px;
        }
        .sphere-animation .orbit:nth-child(2) .dot {
          width: 1em;
          height: 1em;
          margin: -0.5em;
          -webkit-animation-name: A_5;
          animation-name: A_5;
        }
        .sphere-animation .orbit:nth-child(3) {
          width: 35em;
          height: 35em;
          margin: -17.5em;
          -webkit-animation-name: A_6;
          animation-name: A_6;
        }
        .sphere-animation .orbit:nth-child(3) .dot {
          width: 0.8em;
          height: 0.8em;
          margin: -0.4em;
          -webkit-animation-name: A_7;
          animation-name: A_7;
        }
        @-webkit-keyframes A_1 {
          0%, 100% {
            -webkit-transform: translate(0, -4.5em) scale(0.6);
            transform: translate(0, -4.5em) scale(0.6);
            opacity: 1;
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 4.5em) scale(1);
            transform: translate(0, 4.5em) scale(1);
            opacity: 1;
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @keyframes A_1 {
          0%, 100% {
            -webkit-transform: translate(0, -4.5em) scale(0.6);
            transform: translate(0, -4.5em) scale(0.6);
            opacity: 1;
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 4.5em) scale(1);
            transform: translate(0, 4.5em) scale(1);
            opacity: 1;
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @-webkit-keyframes A_2 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(65deg) rotateY(0deg);
            transform: rotateZ(0deg) rotateX(65deg) rotateY(0deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(65deg) rotateY(0deg);
            transform: rotateZ(360deg) rotateX(65deg) rotateY(0deg);
          }
        }
        @keyframes A_2 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(65deg) rotateY(0deg);
            transform: rotateZ(0deg) rotateX(65deg) rotateY(0deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(65deg) rotateY(0deg);
            transform: rotateZ(360deg) rotateX(65deg) rotateY(0deg);
          }
        }
        @-webkit-keyframes A_3 {
          0%, 100% {
            -webkit-transform: translate(0, -7.5em);
            transform: translate(0, -7.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 7.5em);
            transform: translate(0, 7.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @keyframes A_3 {
          0%, 100% {
            -webkit-transform: translate(0, -7.5em);
            transform: translate(0, -7.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 7.5em);
            transform: translate(0, 7.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @-webkit-keyframes A_4 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(-65deg) rotateY(0deg);
            transform: rotateZ(0deg) rotateX(-65deg) rotateY(0deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(-65deg) rotateY(0deg);
            transform: rotateZ(360deg) rotateX(-65deg) rotateY(0deg);
          }
        }
        @keyframes A_4 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(-65deg) rotateY(0deg);
            transform: rotateZ(0deg) rotateX(-65deg) rotateY(0deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(-65deg) rotateY(0deg);
            transform: rotateZ(360deg) rotateX(-65deg) rotateY(0deg);
          }
        }
        @-webkit-keyframes A_5 {
          0%, 100% {
            -webkit-transform: translate(0, -12.5em);
            transform: translate(0, -12.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 12.5em);
            transform: translate(0, 12.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @keyframes A_5 {
          0%, 100% {
            -webkit-transform: translate(0, -12.5em);
            transform: translate(0, -12.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 12.5em);
            transform: translate(0, 12.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @-webkit-keyframes A_6 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(25deg) rotateY(45deg);
            transform: rotateZ(0deg) rotateX(25deg) rotateY(45deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(25deg) rotateY(45deg);
            transform: rotateZ(360deg) rotateX(25deg) rotateY(45deg);
          }
        }
        @keyframes A_6 {
          0% {
            -webkit-transform: rotateZ(0deg) rotateX(25deg) rotateY(45deg);
            transform: rotateZ(0deg) rotateX(25deg) rotateY(45deg);
          }
          100% {
            -webkit-transform: rotateZ(360deg) rotateX(25deg) rotateY(45deg);
            transform: rotateZ(360deg) rotateX(25deg) rotateY(45deg);
          }
        }
        @-webkit-keyframes A_7 {
          0%, 100% {
            -webkit-transform: translate(0, -17.5em);
            transform: translate(0, -17.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 17.5em);
            transform: translate(0, 17.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
        @keyframes A_7 {
          0%, 100% {
            -webkit-transform: translate(0, -17.5em);
            transform: translate(0, -17.5em);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
          }
          50% {
            -webkit-transform: translate(0, 17.5em);
            transform: translate(0, 17.5em);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
          }
        }
      `}</style>
      <div className="sphere-animation text-[6px] lg:text-[7px]">
        <div className="sphere">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="orbit">
          <div className="dot"></div>
        </div>
        <div className="orbit">
          <div className="dot"></div>
        </div>
        <div className="orbit">
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}
