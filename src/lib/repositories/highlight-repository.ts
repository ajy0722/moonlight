import type { NewHighlightInput, SubjectHighlight } from "@/types/highlight";

/**
 * 전공 요약(하이라이트) 데이터 접근 인터페이스.
 *
 * TaskRepository와 동일한 패턴: LocalHighlightRepository(로컬 스토리지)를
 * 다른 구현으로 교체해도 훅/컴포넌트 쪽 코드는 수정할 필요가 없다.
 */
export interface HighlightRepository {
  list(): Promise<SubjectHighlight[]>;
  listBySubject(subjectSlug: string): Promise<SubjectHighlight[]>;
  create(input: NewHighlightInput): Promise<SubjectHighlight>;
  remove(id: string): Promise<void>;
}
