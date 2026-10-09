export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-5">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded bg-gray-200 lg:col-span-2" />
        <div className="h-72 rounded bg-gray-200" />
      </div>
    </div>
  );
}
