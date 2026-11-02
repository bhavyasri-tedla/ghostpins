import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Lock } from "lucide-react";

import { consumePinView } from "@/lib/pins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WorkspacePageProps = {
  params: {
    token: string;
  };
};

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const pin = await consumePinView(params.token);

  if (!pin) {
    notFound();
  }

  const maxViews = pin.maxViews ?? 1;
  const viewsUsed = pin.viewsUsed ?? 1;
  const viewsRemaining = Math.max(maxViews - viewsUsed, 0);

  return (
    <main className="min-h-screen bg-[#080b12] px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Ghost<span className="text-violet-400">Pins</span>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Lock size={16} className="text-violet-400" />
          Private workspace
        </div>
      </nav>

      <section className="mx-auto mt-16 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-violet-950/20 sm:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-violet-300">
              {pin.contentType}
            </span>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} />
              Expires {pin.expiresAt.toLocaleString()}
            </div>
          </div>

          <h1 className="mb-6 break-words text-3xl font-bold">
            {pin.title}
          </h1>

          <div className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-sm leading-7 text-gray-200 sm:p-6">
            {pin.payload}
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
            <p className="text-sm text-gray-300">
              Views used: {viewsUsed} / {maxViews}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {viewsRemaining === 0
                ? "This was the final allowed view. The link is now consumed."
                : `${viewsRemaining} ${
                    viewsRemaining === 1 ? "view" : "views"
                  } remaining. Refreshing this page uses another view.`}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm transition hover:bg-white/10"
          >
            Create another private note
          </Link>
        </div>
      </section>
    </main>
  );
}