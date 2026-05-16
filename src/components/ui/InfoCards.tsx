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
    title: '24-hour self-expiry',
  },
];

export default function InfoCards() {
  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <div className="min-w-0 flex-1">
        <Card
          style={{ width: '100%', height: 144 }}
          variant="paper"
          colors={cardColors}
        >
          <div className="-mt-2 flex h-full items-center gap-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 sm:size-12">
              <LockKeyhole size={22} className="text-accent sm:size-6" />
            </div>
            <div className="flex flex-col justify-center gap-1 text-left">
              <h2 className="text-xl leading-none font-medium italic sm:text-2xl">
                End-to-End Encryption
              </h2>
              <p className="text-muted font-note text-xs leading-tight sm:text-sm">
                AES-256-GCM encryption layers are applied locally. Every byte is
                encrypted in your browser before it ever hits our server
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full md:w-[340px]">
        <Card
          style={{ width: '100%', height: 144 }}
          variant="paper"
          colors={cardColors}
        >
          <div className="flex size-full flex-row items-center justify-center gap-2 sm:gap-4">
            {/* Left Column */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl leading-none font-bold text-[#f3ba61] italic sm:text-4xl">
                100MB
              </span>
              <span className="text-muted mt-2 text-center text-xs leading-none font-semibold tracking-widest uppercase">
                Max File
              </span>
            </div>

            <div className="bg-border h-16 w-px sm:h-[60%]"></div>

            {/* Right Column */}
            <div className="flex min-w-0 flex-col justify-center gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex min-w-0 items-center gap-3"
                >
                  <item.icon
                    size={18}
                    className="text-accent mt-px shrink-0"
                    strokeWidth={2.5}
                  />
                  <p className="text-text text-md min-w-0 leading-none font-medium whitespace-nowrap">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
