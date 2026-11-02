
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Clock, Lock, Zap } from "lucide-react";

type PinViewLimit = 1 | 3 | 5;

type CreatePinResponse = {
  workspaceToken?: string;
  workspaceUrl?: string;
  expiresAt?: string;
  maxViews?: number;
  error?: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [payload, setPayload] = useState("");
  const [contentType, setContentType] = useState("text");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [maxViews, setMaxViews] = useState<PinViewLimit>(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setWorkspaceUrl("");
    setLoading(true);

    try {
      const response = await fetch("/api/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          payload,
          contentType,
          durationMinutes: Number(durationMinutes),
          maxViews,
        }),
      });

      const data: CreatePinResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create pin.");
        return;
      }

      if (!data.workspaceUrl) {
        setError("The pin was created, but no workspace link was returned.");
        return;
      }

      setWorkspaceUrl(data.workspaceUrl);
    } catch (submitError) {
      console.error("GhostPins form error:", submitError);
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Ghost<span className="text-violet-400">Pins</span>
        </Link>

        <Link
          href="#create"
          className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10"
        >
          Get started
        </Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center">
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
          <Zap size={15} />
          Private. Temporary. Secure.
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          Share a secret.
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            Let it disappear.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400">
          Create temporary notes that vanish when their expiration time arrives.
          Share a link, not your secrets.
        </p>

        <div
          id="create"
          className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left shadow-2xl shadow-violet-950/20 sm:p-8"
        >
          <h2 className="text-xl font-semibold">Create a private note</h2>

          <p className="mt-2 text-sm text-gray-400">
            Your note will be available through a unique private link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Note title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Project configuration"
              className="mb-5 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />

            <label
              htmlFor="payload"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Your secret message
            </label>

            <textarea
              id="payload"
              name="payload"
              required
              maxLength={100000}
              rows={6}
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
              placeholder="Write your private message here..."
              className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contentType"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Content type
                </label>

                <select
                  id="contentType"
                  name="contentType"
                  value={contentType}
                  onChange={(event) => setContentType(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111522] p-3 text-sm text-white outline-none focus:border-violet-400"
                >
                  <option value="text">Plain text</option>
                  <option value="code">Code</option>
                  <option value="env">Environment variables</option>
                  <option value="link">Link</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="durationMinutes"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Expiration
                </label>

                <select
                  id="durationMinutes"
                  name="durationMinutes"
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#111522] p-3 text-sm text-white outline-none focus:border-violet-400"
                >
                  <option value="15">15 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">24 hours</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="maxViews"
                className="mb-2 block text-sm text-gray-300"
              >
                Maximum views
              </label>

              <select
                id="maxViews"
                name="maxViews"
                value={maxViews}
                onChange={(event) =>
                  setMaxViews(Number(event.target.value) as PinViewLimit)
                }
                className="w-full rounded-xl border border-white/10 bg-[#111522] p-3 text-sm text-white outline-none focus:border-violet-400"
              >
                <option value={1}>Burn after 1 view</option>
                <option value={3}>Allow 3 views</option>
                <option value={5}>Allow 5 views</option>
              </select>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {workspaceUrl && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="font-medium text-emerald-300">
                  Your private link was created!
                </p>

                <Link
                  href={workspaceUrl}
                  className="mt-2 block break-all text-sm text-cyan-300 underline"
                >
                  {workspaceUrl}
                </Link>

                <p className="mt-2 text-xs text-gray-400">
                  Save this link and share it with the intended recipient.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-4 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating private link..." : "Create private link"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Do not store passwords, financial credentials, or highly sensitive
            information.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-8 text-left sm:grid-cols-3">
          <div>
            <Lock className="mb-4 text-violet-400" size={25} />
            <h3 className="font-semibold">Private by design</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Notes are accessed through unique, hard-to-guess links.
            </p>
          </div>

          <div>
            <Clock className="mb-4 text-cyan-300" size={25} />
            <h3 className="font-semibold">Automatic expiration</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Set an expiration time for your private note.
            </p>
          </div>

          <div>
            <Zap className="mb-4 text-violet-400" size={25} />
            <h3 className="font-semibold">Simple sharing</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create a link and share it with the intended recipient.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        GhostPins — temporary notes for a more private web.
      </footer>
    </main>
  );
}
