"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/discover", label: "Discover" },
  { href: "/profile", label: "Profile" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* Desktop top bar */}
      <header className="top-bar">
        <div className="top-bar-inner">
          <Link href="/" className="brand-mark">
            PulseGather
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary"
                    type="button"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" className="btn-secondary">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile dock */}
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
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/events/new"
          className="dock-create"
          aria-label="Create event"
        >
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
