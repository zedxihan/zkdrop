import { Button } from 'sketchbook-ui';
import type { ActionButtonProps } from '../../types';

export default function ActionButton({
  icon,
  label,
  onClick,
}: ActionButtonProps) {
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
