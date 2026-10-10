export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Modul ini dibangun pada fase berikutnya.
      </p>
    </div>
  );
}
