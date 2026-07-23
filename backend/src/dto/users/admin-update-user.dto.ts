export interface AdminUpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  role?: string;
  isActive?: boolean;
}
