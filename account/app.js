import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL } from "./config.js";
export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const $ = (s) => document.querySelector(s);
export const base = SITE_URL + "/account/";
export function msg(el, text, ok = false) { el.textContent = text; el.className = "msg " + (ok ? "ok" : "err"); }
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const money = (cents, cur = "EUR") => new Intl.NumberFormat("en-IE", { style: "currency", currency: cur }).format((cents || 0) / 100);
export const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === "https:" ? x.href : null; } catch { return null; } };

// Require a signed-in session; if the user has TOTP enrolled, require AAL2.
export async function requireAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.href = "login.html"; return null; }
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") { location.href = "mfa.html?challenge=1"; return null; }
  return session.user;
}
export async function logout() { await sb.auth.signOut(); location.href = "login.html"; }
