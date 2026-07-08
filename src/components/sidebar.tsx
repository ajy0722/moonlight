"use client";

import { BookOpen, CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDY_SUBJECTS } from "@/lib/subjects";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 border-r border-slate-200/70 bg-white/60 px-4 py-8 dark:border-slate-800/70 dark:bg-slate-900/40">
      <div className="flex items-center gap-2 px-2 text-xs font-medium tracking-wide text-indigo-500 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        Personal Assistant
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarLink href="/" active={pathname === "/"}>
          <CalendarCheck2 className="h-4 w-4" />
          일정
        </SidebarLink>

        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
          <BookOpen className="h-3.5 w-3.5" />
          공부
        </div>
        <div className="flex flex-col gap-1">
          {STUDY_SUBJECTS.map((subject) => {
            const href = `/study/${subject.slug}`;
            return (
              <SidebarLink key={subject.slug} href={href} active={pathname === href} nested>
                {subject.name}
              </SidebarLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  nested,
  children,
}: {
  href: string;
  active: boolean;
  nested?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
        nested ? "ml-2" : ""
      } ${
        active
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
      }`}
    >
      {children}
    </Link>
  );
}
