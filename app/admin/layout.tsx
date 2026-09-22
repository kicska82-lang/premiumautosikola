import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 bg-slate-900 text-white">

        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold">
            Premium Autósiskola
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Admin felület
          </p>
        </div>

        <nav className="p-4 space-y-2">

          <Link href="/admin/hero"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            ✨ Hero
          </Link>
          <Link href="/admin/courses"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            📚 Képzések
          </Link>
          <Link href="/admin/instructors"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            👨‍🏫 Oktatók
          </Link>

          <Link href="/admin/cars"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            🚗 Autók
          </Link>

          <Link href="/admin/testimonials"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            ⭐ Vélemények
          </Link>

          <Link
            href="/admin/settings"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            ⚙️ Oldalbeállítások
          </Link>

          <Link href="/admin/applications" className="block rounded-xl px-4 py-3 hover:bg-slate-800">
            📝 Jelentkezések
          </Link>

        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
