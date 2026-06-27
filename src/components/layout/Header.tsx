import { Box, Heart, Star } from 'lucide-react';
import { Link } from 'react-router';

const actionBtn =
  'text-muted flex size-9 items-center justify-center rounded-lg transition-all duration-300 ease-out md:hover:scale-110 hover:text-text active:scale-90';

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-235 items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 md:px-0">
      {/* Logo */}
      <Link to="/" className="group flex min-w-0 items-center gap-2.5">
        <div className="bg-accent text-bg flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-active:scale-95 sm:size-11 md:group-hover:scale-110">
          <Box size={22} strokeWidth={2.2} className="sm:size-6" />
        </div>

        <div className="flex min-w-0 flex-col">
          <h1 className="text-text text-3xl leading-none font-bold tracking-tight sm:text-4xl">
            ZK<span className="text-accent">Drop</span>
          </h1>
          <span className="text-muted truncate text-[10px] uppercase opacity-70 sm:text-xs">
            Zero-Knowledge Share
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="border-border bg-card flex shrink-0 items-center gap-1 rounded-xl border p-1">
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
