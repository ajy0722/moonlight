import type { SubjectFile } from "@/types/subject-file";

/**
 * 전공 자료(PDF 등) 파일 데이터 접근 인터페이스.
 *
 * 다른 Repository와 동일한 패턴: IndexedDbFileRepository를 다른 구현으로
 * 교체해도 훅/컴포넌트 쪽 코드는 수정할 필요가 없다.
 */
export interface FileRepository {
  listBySubject(subjectSlug: string): Promise<SubjectFile[]>;
  upload(subjectSlug: string, file: File): Promise<SubjectFile>;
  getBlob(id: string): Promise<Blob | undefined>;
  remove(id: string): Promise<void>;
}
