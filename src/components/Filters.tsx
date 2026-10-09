"use client";
import { useRouter } from "next/navigation";

export interface FilterOption { value: string; label: string }
export interface FilterDef { name: string; label: string; options: FilterOption[]; value: string; allLabel?: string }

/** Builds a URL from base path + current query, replacing one key. */
export function FilterBar({ basePath, query, filters, pathFilters }: { basePath: string; query: Record<string, string>; filters: FilterDef[]; pathFilters?: FilterDef[] }) {
  const router = useRouter();
  const go = (name: string, value: string, isPath: boolean) => {
    if (isPath) {
      // pathFilters encode into basePath via template: basePath contains `{name}` tokens
      const vals: Record<string, string> = Object.fromEntries((pathFilters ?? []).map((f) => [f.name, f.value]));
      vals[name] = value;
      let path = basePath;
      for (const [k, v] of Object.entries(vals)) path = path.replace(`{${k}}`, v);
      router.push(path);
      return;
    }
    const q = new URLSearchParams(query);
    if (value) q.set(name, value); else q.delete(name);
    q.delete("page");
    let path = basePath;
    for (const f of pathFilters ?? []) path = path.replace(`{${f.name}}`, f.value);
    router.push(`${path}${q.toString() ? `?${q}` : ""}`);
  };
  const Sel = ({ f, isPath }: { f: FilterDef; isPath: boolean }) => (
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
      {f.label}
      <select
        value={f.value}
        onChange={(e) => go(f.name, e.target.value, isPath)}
        className="rounded border border-line bg-white px-2 py-1.5 text-sm font-semibold normal-case tracking-normal text-gray-900 outline-none focus:border-brand"
      >
        {f.allLabel !== undefined && <option value="">{f.allLabel}</option>}
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded border border-line bg-white p-3">
      {(pathFilters ?? []).map((f) => <Sel key={f.name} f={f} isPath />)}
      {filters.map((f) => <Sel key={f.name} f={f} isPath={false} />)}
    </div>
  );
}
