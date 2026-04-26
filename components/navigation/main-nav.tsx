"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";

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
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/85 backdrop-blur-md hidden md:block">
        <div className="flex h-14 items-center justify-between max-w-3xl mx-auto px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
            Mingle
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                    active ? "text-foreground bg-muted/50" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
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
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    size="sm"
                    type="button"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile dock */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 items-center border-t bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] pt-1 px-1 md:hidden" aria-label="Primary">
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-h-[3rem] text-[11px] font-medium rounded-lg transition-colors ${
                active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/events/new"
          className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-foreground text-background text-lg font-medium leading-none shadow-sm hover:opacity-90 transition-opacity"
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
              className={`flex flex-col items-center justify-center min-h-[3rem] text-[11px] font-medium rounded-lg transition-colors ${
                active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
