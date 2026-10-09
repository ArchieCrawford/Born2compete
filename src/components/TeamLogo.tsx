import type { Team } from "@/lib/types";

export function TeamLogo({ team, size = 24, className = "" }: { team: Team; size?: number; className?: string }) {
  const fontSize = Math.max(8, Math.round(size * 0.36));
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-display font-bold leading-none ${className}`}
      style={{ width: size, height: size, background: team.primary, color: team.secondary, fontSize, boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.35)" }}
      aria-label={team.name}
      title={team.name}
    >
      {team.abbr.slice(0, 4)}
    </span>
  );
}
