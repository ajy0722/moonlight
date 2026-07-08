export interface SubjectHighlight {
  id: string;
  subjectSlug: string;
  title: string;
  summary: string;
  createdAt: string;
}

export interface NewHighlightInput {
  subjectSlug: string;
  title: string;
  summary: string;
}
