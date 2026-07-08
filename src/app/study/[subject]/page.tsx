import { NotebookPen } from "lucide-react";
import { notFound } from "next/navigation";
import { getSubjectBySlug, STUDY_SUBJECTS } from "@/lib/subjects";

export function generateStaticParams() {
  return STUDY_SUBJECTS.map((subject) => ({ subject: subject.slug }));
}

export default async function StudySubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubjectBySlug(slug);
  if (!subject) notFound();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-indigo-500 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          공부
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {subject.name}
        </h1>
      </header>

      <section className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-10 text-center shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <NotebookPen className="h-5 w-5" />
        </span>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          아직 정리한 내용이 없습니다. 곧 {subject.name} 공부 내용을 이 페이지에 정리할 예정입니다.
        </p>
      </section>
    </div>
  );
}
