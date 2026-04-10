import { Divider } from 'sketchbook-ui';
import 'sketchbook-ui/style.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-auto flex w-full flex-col items-center">
      <div className="w-full max-w-[940px] px-6 sm:px-0">
        <Divider strokeWidth={1} variant="dashed" color="var(--color-accent)" />
      </div>

      <footer className="text-muted mx-auto flex w-full max-w-[940px] flex-col items-center justify-between gap-4 px-6 pt-2 pb-6 text-sm sm:flex-row sm:px-0">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="font-note tracking-tight">
            © {currentYear} ZKDrop — All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-lg font-medium">
          <a href="#" className="hover:text-text transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-text transition-colors">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
