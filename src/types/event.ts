export interface ScheduleEvent {
  id: string;
  title: string;
  /** YYYY-MM-DD (로컬 날짜 기준) */
  date: string;
  /** HH:mm, 빈 문자열이면 종일 일정 */
  time: string;
  memo: string;
  createdAt: string;
}

export interface NewEventInput {
  title: string;
  date: string;
  time: string;
  memo: string;
}
