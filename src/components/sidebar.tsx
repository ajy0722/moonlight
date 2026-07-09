"use client";

import { Calculator, CalendarCheck2, Home, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-[#242424] bg-[#111111] px-4 py-8">
      <div className="flex items-center gap-2 px-2 text-xs font-medium tracking-wide text-cyan-400 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        Moonlight
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarLink href="/" active={pathname === "/"}>
          <Home className="h-4 w-4" />
          메인
        </SidebarLink>

        <SidebarLink href="/schedule" active={pathname === "/schedule"}>
          <CalendarCheck2 className="h-4 w-4" />
          일정
        </SidebarLink>

        <SidebarLink href="/timer" active={pathname === "/timer"}>
          <Timer className="h-4 w-4" />
          타이머
        </SidebarLink>

        <SidebarLink href="/calculator" active={pathname === "/calculator"}>
          <Calculator className="h-4 w-4" />
          계산기
        </SidebarLink>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-cyan-500/10 text-cyan-300"
          : "text-neutral-400 hover:bg-[#1e1e1e] hover:text-neutral-200"
      }`}
    >
      {children}
    </Link>
  );
}
