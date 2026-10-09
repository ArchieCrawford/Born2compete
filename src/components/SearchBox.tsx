export function SearchBox({ defaultValue = "", large = false }: { defaultValue?: string; large?: boolean }) {
  return (
    <form action="/search" method="get" role="search" className={large ? "w-full" : "hidden md:block"}>
      <label className="sr-only" htmlFor={large ? "search-large" : "search-header"}>Search</label>
      <input
        id={large ? "search-large" : "search-header"}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search players, teams, news..."
        className={
          large
            ? "w-full rounded border border-line bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-brand"
            : "w-56 rounded bg-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white focus:text-gray-900"
        }
      />
    </form>
  );
}
