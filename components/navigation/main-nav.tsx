"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarBlank,
  Compass,
  House,
  Plus,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { MingleLogo } from "@/components/brand/mingle-logo";

const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/events", label: "Events", icon: CalendarBlank },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/profile", label: "Profile", icon: UserCircle },
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
      <header className="sticky inset-x-0 top-0 z-50 hidden border-b border-border/70 bg-background/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-normal text-foreground">
            <MingleLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                    active ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                  }`}
                >
                  <Icon size={16} weight={active ? "regular" : "light"} />
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
                    variant="tertiary"
                    size="sm"
                    type="button"
                    className="[&>span]:inline-flex [&>span]:items-center [&>span]:gap-1"
                  >
                    <SignOut size={14} />
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

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 items-center border-t border-border/70 bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden" aria-label="Primary">
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${
                active ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
              }`}
            >
              <Icon size={19} weight={active ? "regular" : "light"} />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/events/new"
          className="mx-auto flex size-11 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-opacity hover:opacity-90"
          aria-label="Create event"
        >
          <Plus size={21} weight="bold" />
        </Link>

        {navItems.slice(2).map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${
                active ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
              }`}
            >
              <Icon size={19} weight={active ? "regular" : "light"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
