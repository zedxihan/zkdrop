import { Card } from 'sketchbook-ui';
import { Clock3, LockKeyhole, UserRoundX } from 'lucide-react';

const cardColors = {
  bg: 'var(--color-card)',
  bgOverlay: 'var(--color-card)',
  stroke: 'var(--color-border)',
  text: 'var(--color-text)',
};

const highlights = [
  {
    icon: UserRoundX,
    title: 'No login required',
  },
  {
    icon: Clock3,
    title: '6-hour self-expiry',
  },
];

export default function InfoCards() {
  return (
    <div className="mx-auto mt-4 flex w-full max-w-[940px] gap-4">
      <div className="flex-1">
        <Card
          style={{ width: '100%', height: 144 }}
          variant="paper"
          colors={cardColors}
        >
          <div className="-mt-1 flex h-full items-center gap-5 px-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5">
              <LockKeyhole size={24} className="text-accent" />
            </div>
            <div className="flex flex-col justify-center gap-1 text-left">
              <h2 className="text-2xl leading-none font-medium italic">
                End-to-End Encryption
              </h2>
              <p className="text-muted font-note text-sm leading-tight">
                AES-256-GCM encryption layers are applied locally. Every byte is
                encrypted in your browser before it ever hits our server
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        style={{ width: 340, height: 144 }}
        variant="paper"
        colors={cardColors}
      >
        <div className="flex h-full w-full flex-row items-center justify-center gap-6">
          {/* Left Column */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl leading-none font-bold text-[#f3ba61] italic">
              30MB
            </span>
            <span className="text-muted mt-2 text-center text-xs leading-none font-semibold tracking-widest uppercase">
              Max File
            </span>
          </div>

          <div className="bg-border h-[60%] w-px"></div>

          {/* Right Column */}
          <div className="flex flex-col justify-center gap-4">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <item.icon
                  size={18}
                  className="text-accent mt-px shrink-0"
                  strokeWidth={2.5}
                />
                <p className="text-text text-md leading-none font-medium whitespace-nowrap">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
