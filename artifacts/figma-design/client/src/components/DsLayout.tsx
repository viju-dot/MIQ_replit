import { Suspense, useState } from "react";
import { Link, useRoute } from "wouter";
import { Menu, Moon, Sun, X } from "lucide-react";
import { dsPages, getPage } from "@/pages/registry";
import { useTheme } from "@/lib/theme";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
        dark
          ? "border-[#4b4b59] bg-[#26262e] text-[#f7f7fa] hover:bg-[#33333d]"
          : "border-[#e1e1e8] bg-white text-[#4b4b59] hover:bg-[#f7f7fa]"
      }`}
    >
      {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      {dark ? "Dark" : "Light"}
    </button>
  );
}

function Sidebar({ activeSlug, onNavigate }: { activeSlug?: string; onNavigate?: () => void }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <nav
      className={`flex h-full flex-col ${dark ? "bg-[#1c1c21]" : "bg-white"}`}
      aria-label="Design system pages"
    >
      <div className={`border-b px-5 py-5 ${dark ? "border-[#33333d]" : "border-[#e1e1e8]"}`}>
        <Link
          href="/"
          onClick={onNavigate}
          className={`font-headline-sm-semibold text-[17px] font-semibold ${
            dark ? "text-[#f7f7fa]" : "text-[#13131a]"
          }`}
        >
          Fiber Design System
        </Link>
        <p className="mt-0.5 text-[12px] text-[#a8a8b2]">Component explorer</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-[#a8a8b2]">
          Components
        </p>
        <ul className="space-y-0.5">
          {dsPages.map((page) => {
            const active = page.slug === activeSlug;
            return (
              <li key={page.slug}>
                <Link
                  href={`/${page.slug}`}
                  onClick={onNavigate}
                  className={`block rounded-md px-2.5 py-1.5 text-[14px] transition-colors ${
                    active
                      ? "bg-[#f6ebff] font-medium text-[#7c33b5]"
                      : dark
                        ? "text-[#e1e1e8] hover:bg-[#33333d]"
                        : "text-[#13131a] hover:bg-[#71718014]"
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
  const [, params] = useRoute("/:slug");
  const slug = params?.slug;
  const page = slug ? getPage(slug) : undefined;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const border = dark ? "border-[#33333d]" : "border-[#e1e1e8]";

  return (
    <div className={`flex min-h-screen ${dark ? "bg-[#131318]" : "bg-[#f5f5f8]"}`}>
      {/* Desktop sidebar */}
      <aside className={`sticky top-0 hidden h-screen w-64 shrink-0 border-r md:block ${border}`}>
        <Sidebar activeSlug={page?.slug} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className={`absolute inset-y-0 left-0 w-64 border-r shadow-lg ${border}`}>
            <Sidebar activeSlug={page?.slug} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header
          className={`sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 md:hidden ${border} ${
            dark ? "bg-[#1c1c21]" : "bg-white"
          }`}
        >
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            className={dark ? "text-[#f7f7fa]" : "text-[#13131a]"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span
            className={`flex-1 text-[15px] font-semibold ${dark ? "text-[#f7f7fa]" : "text-[#13131a]"}`}
          >
            {page?.title ?? "Fiber Design System"}
          </span>
          <ThemeSwitch />
        </header>

        <main className="min-w-0">
          {page ? (
            <div>
              <div
                className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5 md:px-10 ${border} ${
                  dark ? "bg-[#1c1c21]" : "bg-white"
                }`}
              >
                <div>
                  <h1
                    className={`text-[22px] font-semibold ${dark ? "text-[#f7f7fa]" : "text-[#13131a]"}`}
                  >
                    {page.title}
                  </h1>
                  <p className="mt-0.5 text-[13px] text-[#a8a8b2]">
                    Imported from Figma — explore variants and properties live
                  </p>
                </div>
                <div className="hidden md:block">
                  <ThemeSwitch />
                </div>
              </div>
              <div className="px-6 py-8 md:px-10">
                <Suspense fallback={<p className="text-[14px] text-[#a8a8b2]">Loading…</p>}>
                  <page.component />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
              <h1
                className={`text-[26px] font-semibold ${dark ? "text-[#f7f7fa]" : "text-[#13131a]"}`}
              >
                Fiber Design System
              </h1>
              <p className="mt-2 max-w-md text-[14px] text-[#71717a]">
                Select a component page from the sidebar to explore its variants, adjust
                properties, and preview it live in light or dark mode.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
