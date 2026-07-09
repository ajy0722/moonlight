"use client";

import {
  Calculator,
  CalendarCheck2,
  Home,
  ListTodo,
  PanelLeftClose,
  PanelLeftOpen,
  Timer,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "메인", icon: Home },
  { href: "/schedule", label: "일정", icon: CalendarCheck2 },
  { href: "/todo", label: "할 일", icon: ListTodo },
  { href: "/timer", label: "타이머", icon: Timer },
  { href: "/calculator", label: "계산기", icon: Calculator },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col gap-6 border-r border-[#242424] bg-[#111111] py-8 transition-all duration-200 ${
        collapsed ? "w-16 px-2" : "w-56 px-4"
      }`}
    >
      <div className={`flex items-center gap-1 px-1 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-cyan-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Moonlight
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#1e1e1e] hover:text-neutral-200"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <SidebarLink key={href} href={href} label={label} active={pathname === href} collapsed={collapsed}>
            <Icon className="h-4 w-4 shrink-0" />
          </SidebarLink>
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  active,
  collapsed,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-2 rounded-xl py-2 text-sm font-medium transition ${
        collapsed ? "justify-center px-2" : "px-3"
      } ${
        active
          ? "bg-cyan-500/10 text-cyan-300"
          : "text-neutral-400 hover:bg-[#1e1e1e] hover:text-neutral-200"
      }`}
    >
      {children}
      {!collapsed && label}
    </Link>
  );
}
