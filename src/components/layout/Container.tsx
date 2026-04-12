import InfoCards from '../ui/InfoCards';
import type { ContainerProps } from '../../types';

export default function Container({
  title,
  accent,
  subtitle,
  children,
  error,
}: ContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-5">
      <div className="w-full text-center">
        <h2 className="text-text mb-3 text-3xl leading-none font-bold sm:text-4xl md:text-5xl">
          {title}{' '}
          <span className="text-accent pb-1 underline decoration-dashed underline-offset-8">
            {accent}
          </span>
        </h2>
        <p className="text-muted mx-auto mt-2 max-w-2xl text-lg sm:text-xl md:text-2xl">
          {subtitle}
        </p>
      </div>

      <div className="w-full">{children}</div>

      <InfoCards />

      {error && (
        <p className="font-note text-center text-red-500">Error: {error}</p>
      )}
    </div>
  );
}
