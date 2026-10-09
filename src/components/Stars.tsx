export function Stars({ n, size = 14, className = "" }: { n: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-px ${className}`} aria-label={`${n} star`} title={`${n}-star`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={i < n ? "fill-gold" : "fill-gray-300"}>
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 21l1.5-6.8L2.2 9.5l6.9-.7z" />
        </svg>
      ))}
    </span>
  );
}
