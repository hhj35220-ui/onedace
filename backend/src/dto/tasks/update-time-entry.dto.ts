export interface UpdateTimeEntryDto {
  description?: string;
  startTime?: string;
  endTime?: string | null;
  durationMinutes?: number;
}
