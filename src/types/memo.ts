export interface Memo {
  id: string;
  /** 여러 줄 지원. "- "로 시작하는 줄은 불릿, 앞의 공백 2칸당 1단계 들여쓰기 */
  content: string;
  createdAt: string;
}
