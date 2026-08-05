import { Suspense, useState } from "react";
import { Link, useRoute } from "wouter";
import { Menu, X } from "lucide-react";
import { dsPages, getPage } from "@/pages/registry";

function Sidebar({ activeSlug, onNavigate }: { activeSlug?: string; onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col bg-white" aria-label="Design system pages">
      <div className="border-b border-[#e1e1e8] px-5 py-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="font-headline-sm-semibold text-[17px] font-semibold text-[#13131a]"
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

  return (
    <div className="flex min-h-screen bg-[#f5f5f8]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[#e1e1e8] md:block">
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
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-[#e1e1e8] shadow-lg">
            <Sidebar activeSlug={page?.slug} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e1e1e8] bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            className="text-[#13131a]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-[15px] font-semibold text-[#13131a]">
            {page?.title ?? "Fiber Design System"}
          </span>
        </header>

        <main className="min-w-0">
          {page ? (
            <div>
              <div className="border-b border-[#e1e1e8] bg-white px-6 py-5 md:px-10">
                <h1 className="text-[22px] font-semibold text-[#13131a]">{page.title}</h1>
                <p className="mt-0.5 text-[13px] text-[#a8a8b2]">
                  Imported from Figma — all components and variants from this page
                </p>
              </div>
              <div className="px-6 py-8 md:px-10">
                <Suspense
                  fallback={<p className="text-[14px] text-[#a8a8b2]">Loading…</p>}
                >
                  <page.component />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
              <h1 className="text-[26px] font-semibold text-[#13131a]">
                Fiber Design System
              </h1>
              <p className="mt-2 max-w-md text-[14px] text-[#71717a]">
                Select a component page from the sidebar to browse its variants and
                states. New pages appear automatically as they are imported from Figma.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
