export default function Footer() {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Made by <a href="https://saasnext.in/" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">Saasnext</a>
        </p>
      </div>
    </footer>
  );
}
