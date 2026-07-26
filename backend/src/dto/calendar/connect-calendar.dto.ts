export interface ConnectCalendarDto {
  provider: 'GOOGLE' | 'OUTLOOK' | 'ICS';
  externalCalendarId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string | Date;
  syncEnabled?: boolean;
}
