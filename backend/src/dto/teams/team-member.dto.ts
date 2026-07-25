export interface CreateTeamMemberDto {
  userId: string;
  role?: 'ADMIN' | 'MEMBER';
}

export interface UpdateTeamMemberDto {
  role: 'ADMIN' | 'MEMBER';
}
