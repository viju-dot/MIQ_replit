import { Suspense, useState } from "react";
import { Link, useRoute } from "wouter";
import { Menu, X } from "lucide-react";
import { dsPages, getPage } from "@/pages/registry";

/*
 * Design System explorer — now mounted INSIDE the app shell at /design-system.
 * It renders its own secondary (narrow) component list column plus the live
 * component preview. The app shell already provides the primary sidebar,
 * header and theme toggle, so this component no longer renders those.
 *
 * Explorer chrome is token-driven: every color references a Figma variable
 * from tokens.css, so [data-theme="dark"] flips the whole layout with no
 * per-component conditionals.
 */
const surface = "bg-[var(--surface-background-lvl1,#ffffff)]";
const canvasBg = "bg-[var(--surface-background-lvl2,#f7f7fa)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]";
const textBody = "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]";

// Explorer routes live under the /design-system module prefix.
const BASE = "/design-system";

function Sidebar({ activeSlug, onNavigate }: { activeSlug?: string; onNavigate?: () => void }) {
  return (
    <nav className={`flex h-full flex-col ${surface}`} aria-label="Design system pages">
      <div className={`border-b px-5 py-5 ${borderToken}`}>
        <Link
          href={BASE}
          onClick={onNavigate}
          className={`font-headline-sm-semibold text-[17px] font-semibold ${textPrimary}`}
        >
          Fiber Design System
        </Link>
        <p className={`mt-0.5 text-[12px] ${textMuted}`}>Component explorer</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className={`px-2 pb-2 text-[11px] font-medium uppercase tracking-wide ${textMuted}`}>
          Components
        </p>
        <ul className="space-y-0.5">
          {dsPages.map((page) => {
            const active = page.slug === activeSlug;
            return (
              <li key={page.slug}>
                <Link
                  href={`${BASE}/${page.slug}`}
                  onClick={onNavigate}
                  className={`block rounded-md px-2.5 py-1.5 text-[14px] transition-colors ${
                    active
                      ? "bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)] font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]"
                      : `${textPrimary} hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]`
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function DsLayout() {
  const [, params] = useRoute(`${BASE}/:slug`);
  const slug = params?.slug;
  const page = slug ? getPage(slug) : undefined;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`flex min-h-full ${canvasBg}`}>
      {/* Desktop secondary component list column */}
      <aside
        className={`sticky top-[57px] hidden h-[calc(100vh-57px)] w-56 shrink-0 border-r md:block ${borderToken}`}
      >
        <Sidebar activeSlug={page?.slug} />
      </aside>

      {/* Mobile component list */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className={`absolute inset-y-0 left-0 w-64 border-r shadow-lg ${borderToken}`}>
            <Sidebar activeSlug={page?.slug} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile explorer bar to reach the component list */}
        <header
          className={`sticky top-[57px] z-20 flex items-center gap-3 border-b px-4 py-3 md:hidden ${borderToken} ${surface}`}
        >
          <button
            type="button"
            aria-label={mobileOpen ? "Close component list" : "Open component list"}
            onClick={() => setMobileOpen((open) => !open)}
            className={textPrimary}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className={`flex-1 text-[15px] font-semibold ${textPrimary}`}>
            {page?.title ?? "Fiber Design System"}
          </span>
        </header>

        <main className="min-w-0">
          {page ? (
            <div>
              <div
                className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5 md:px-10 ${borderToken} ${surface}`}
              >
                <div>
                  <h1 className={`text-[22px] font-semibold ${textPrimary}`}>{page.title}</h1>
                  <p className={`mt-0.5 text-[13px] ${textMuted}`}>
                    Imported from Figma — explore variants and properties live
                  </p>
                </div>
              </div>
              <div className="px-6 py-8 md:px-10">
                <Suspense fallback={<p className={`text-[14px] ${textMuted}`}>Loading…</p>}>
                  <page.component />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
              <h1 className={`text-[26px] font-semibold ${textPrimary}`}>Fiber Design System</h1>
              <p className={`mt-2 max-w-md text-[14px] ${textBody}`}>
                Select a component page from the list to explore its variants, adjust properties,
                and preview it live in light or dark mode.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
