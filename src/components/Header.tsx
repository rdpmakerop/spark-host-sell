import { Link } from "react-router-dom";
import { Server } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Server className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
          <span className="text-2xl font-bold glow-text">SkNode</span>
        </Link>
      </div>
    </header>
  );
};
