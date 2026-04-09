export default function UploadIcon() {
  return (
    <svg
      width="180"
      height="135"
      viewBox="0 0 24 24"
      fill="var(--color-accent)"
      className="transition-opacity hover:opacity-90"
    >
      <path d="M6 18h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.5 1.5A3.5 3.5 0 0 0 6 18z" />
      <path d="M12 12v6.1" stroke="var(--color-bg)" strokeWidth="1.8" />
      <path
        d="M9.5 14.5L12 12l2.5 2.5"
        stroke="var(--color-bg)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
