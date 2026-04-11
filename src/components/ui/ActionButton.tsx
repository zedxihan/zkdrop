import type { ReactNode } from 'react';
import { Button } from 'sketchbook-ui';

interface ButtonProps {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function ActionButton({ icon, label, onClick }: ButtonProps) {
  return (
    <Button
      size="sm"
      showBorder={false}
      colors={{
        bg: 'var(--color-accent)',
        stroke: 'var(--color-accent-hover)',
        text: 'var(--color-bg)',
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {icon}
        {label}
      </div>
    </Button>
  );
}
