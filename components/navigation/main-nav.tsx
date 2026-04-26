"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", shortLabel: "Home" },
  { href: "/events", label: "My Events", shortLabel: "Events" },
  { href: "/discover", label: "Discover", shortLabel: "Discover" },
  { href: "/profile", label: "Profile", shortLabel: "Profile" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-[max(0.4rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-card)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-md">
          <Link href="/" className="brand-mark" aria-label="Open home feed">
            PulseGather
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "nav-chip nav-chip-active" : "nav-chip"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/events/new" className="btn-primary hidden md:inline-flex">
            Create Event
          </Link>
        </div>
      </header>

      <nav className="mobile-dock md:hidden" aria-label="Primary">
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={active ? "dock-link dock-link-active" : "dock-link"}
            >
              {item.shortLabel}
            </Link>
          );
        })}

        <Link href="/events/new" className="dock-create" aria-label="Create a new event">
          +
        </Link>

        {navItems.slice(2).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={active ? "dock-link dock-link-active" : "dock-link"}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
