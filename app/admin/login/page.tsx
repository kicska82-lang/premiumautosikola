"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  async function handleGitHubLogin() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) alert(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-[#0B1024] p-10 shadow-2xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Admin bejelentkezés
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-xl border border-gray-700 bg-[#111827] p-4 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Jelszó"
          className="mb-6 w-full rounded-xl border border-gray-700 bg-[#111827] p-4 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-amber-500 p-4 font-bold text-black hover:bg-amber-400"
        >
          Bejelentkezés
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-700" />
          vagy
          <span className="h-px flex-1 bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full rounded-xl border border-slate-600 bg-white p-4 font-bold text-slate-900 transition hover:bg-slate-100"
        >
          Belépés GitHubbal
        </button>
      </form>
    </div>
  );
}
