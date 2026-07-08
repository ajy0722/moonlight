export interface SubjectFile {
  id: string;
  subjectSlug: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface SubjectFileWithUrl extends SubjectFile {
  url: string;
}
