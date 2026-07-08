import type { Subject } from "@/types/subject";

export const STUDY_SUBJECTS: Subject[] = [
  { slug: "circuit-theory", name: "회로이론" },
  { slug: "signals-systems", name: "신호 및 시스템" },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return STUDY_SUBJECTS.find((subject) => subject.slug === slug);
}
