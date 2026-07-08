import { notFound } from "next/navigation";
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

  return <SubjectHighlights subject={subject} />;
}
