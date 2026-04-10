import { Link } from 'react-router-dom';
import { Box, Heart, Star } from 'lucide-react';

const actionBtn =
  'text-muted flex h-9 w-9 items-center justify-center rounded-lg transition-transform hover:scale-105 active:scale-95';

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[940px] items-center justify-between px-6 py-6 sm:px-0">
      {/* Logo */}
      <Link to="/" className="group flex items-center gap-2.5">
        <div className="bg-accent text-bg flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
          <Box size={24} strokeWidth={2.2} />
        </div>

        <div className="flex flex-col">
          <h1 className="text-text text-4xl leading-none font-bold tracking-tight">
            ZK<span className="text-accent">Drop</span>
          </h1>
          <span className="text-muted text-xs uppercase opacity-70">
            Zero-Knowledge Share
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="border-border bg-card flex items-center gap-1 rounded-xl border p-1">
        <a
          href="https://github.com/zedxihan/zkdrop"
          target="_blank"
          rel="noopener noreferrer"
          className={`${actionBtn} hover:text-text`}
          aria-label="Star on GitHub"
        >
          <Star size={18} strokeWidth={1.5} />
        </a>

        <div className="bg-border mx-1 h-4 w-px opacity-50" />

        <a
          href="https://patreon.com/zedxihan"
          target="_blank"
          rel="noopener noreferrer"
          className={`${actionBtn} hover:text-accent`}
          aria-label="Support Us"
        >
          <Heart size={18} strokeWidth={1.5} />
        </a>
      </div>
    </header>
  );
}
