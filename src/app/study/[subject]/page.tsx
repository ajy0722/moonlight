import { notFound } from "next/navigation";
import { SubjectFiles } from "@/components/study/subject-files";
import { SubjectHighlights } from "@/components/study/subject-highlights";
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

      <SubjectFiles subject={subject} />
      <SubjectHighlights subject={subject} />
    </div>
  );
}
