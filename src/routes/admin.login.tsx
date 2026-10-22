import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { AdminLogo } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { checkAuth, login } from "@/data/auth";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    if (await checkAuth()) throw redirect({ to: "/admin" });
    return null;
  },
  head: () => adminSeo("Sign in"),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await login({ data: { password, remember } });
      if (result.ok) {
        await router.invalidate();
        await router.navigate({ to: "/admin" });
        return;
      }
      setError(result.error ?? "Sign in failed.");
    } catch (e) {
      setError(errorText(e));
    }
    setBusy(false);
  }

  return (
    <main className="admin-login">
      <div className="admin-login-box">
        <AdminLogo />
        <div className="admin-card admin-login-card">
          <p className="admin-label admin-label-accent">Staff area</p>
          <h1>Sign in</h1>
          <p className="admin-muted">
            Manage projects, team, testimonials, brands, quote requests and everything else on the
            Fumati Engineers website.
          </p>
          <form onSubmit={onSubmit} className="admin-form">
            <label className="admin-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Keep me signed in for 30 days
            </label>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="admin-btn admin-btn-primary admin-btn-block"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <a href="/" className="admin-muted" style={{ color: "rgb(255 255 255 / 0.7)" }}>
          ← Back to the website
        </a>
      </div>
    </main>
  );
}
