export function Avatar({ name, size = 48, hue, className = "" }: { name: string; size?: number; hue?: number; className?: string }) {
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const h = hue ?? (name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360);
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-display font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: `linear-gradient(135deg, hsl(${h} 45% 35%), hsl(${(h + 40) % 360} 40% 20%))` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
