import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Nyilvános, csak olvasásra használt kliens. Szándékosan nem továbbítja az
 * admin bejelentkezés sütijeit, így egy lejárt vagy hibás munkamenet nem
 * akadályozhatja a főoldal tartalmának betöltését.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      // A Supabase ingyenes projektje inaktivitás után szünetelhet. Ilyenkor
      // a nyilvános oldal ne várakozzon korlátlanul: a content.ts üres,
      // biztonságos tartalommal folytatja a betöltést.
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(4_000) }),
      },
    }
  );
}
