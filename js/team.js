/**
 * OnePlace Enterprise v3.0 — Team Management Module
 * Vanilla JavaScript (ES6+)
 */

const TEAM_STORAGE_KEYS = {
  TEAM_USERS: 'op_team_users',
  TEAM_TEAMS: 'op_team_teams',
  TEAM_DEPARTMENTS: 'op_team_departments',
  TEAM_ROLES: 'op_team_roles',
  TEAM_PERMISSIONS: 'op_team_permissions',
  TEAM_INVITATIONS: 'op_team_invitations',
  TEAM_ACTIVITY: 'op_team_activity',
  TEAM_SETTINGS: 'op_team_settings'
};

// ============================================
// Sample Data
// ============================================

const SAMPLE_USERS = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex.morgan@oneplace.com', department: 'Management', role: 'administrator', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 2 * 60000).toISOString(), avatar: 'AM', color: '#6366f1', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah.johnson@oneplace.com', department: 'Marketing', role: 'manager', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 5 * 60000).toISOString(), avatar: 'SJ', color: '#8b5cf6', createdAt: '2024-02-01T09:00:00Z' },
  { id: 'u3', name: 'Michael Brown', email: 'michael.brown@oneplace.com', department: 'Engineering', role: 'team-lead', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 10 * 60000).toISOString(), avatar: 'MB', color: '#ec4899', createdAt: '2024-01-20T11:00:00Z' },
  { id: 'u4', name: 'Emily Davis', email: 'emily.davis@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 15 * 60000).toISOString(), avatar: 'ED', color: '#f43f5e', createdAt: '2024-03-05T08:30:00Z' },
  { id: 'u5', name: 'James Wilson', email: 'james.wilson@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 20 * 60000).toISOString(), avatar: 'JW', color: '#f97316', createdAt: '2024-02-15T14:00:00Z' },
  { id: 'u6', name: 'Olivia Martinez', email: 'olivia.martinez@oneplace.com', department: 'Product', role: 'team-lead', team: 'Product', status: 'away', lastActive: new Date(Date.now() - 60 * 60000).toISOString(), avatar: 'OM', color: '#eab308', createdAt: '2024-01-28T10:00:00Z' },
  { id: 'u7', name: 'David Thompson', email: 'david.thompson@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'online', lastActive: new Date(Date.now() - 2 * 3600000).toISOString(), avatar: 'DT', color: '#22c55e', createdAt: '2024-03-10T09:00:00Z' },
  { id: 'u8', name: 'Lisa Anderson', email: 'lisa.anderson@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'offline', lastActive: new Date(Date.now() - 24 * 3600000).toISOString(), avatar: 'LA', color: '#06b6d4', createdAt: '2024-02-20T11:00:00Z' },
  { id: 'u9', name: 'Robert Taylor', email: 'robert.taylor@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 30 * 60000).toISOString(), avatar: 'RT', color: '#6366f1', createdAt: '2024-03-01T08:00:00Z' },
  { id: 'u10', name: 'Amanda White', email: 'amanda.white@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 45 * 60000).toISOString(), avatar: 'AW', color: '#8b5cf6', createdAt: '2024-03-15T10:00:00Z' },
  { id: 'u11', name: 'Chris Martin', email: 'chris.martin@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'offline', lastActive: new Date(Date.now() - 48 * 3600000).toISOString(), avatar: 'CM', color: '#ec4899', createdAt: '2024-02-25T09:00:00Z' },
  { id: 'u12', name: 'Laura Garcia', email: 'laura.garcia@oneplace.com', department: 'Support', role: 'viewer', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 5 * 60000).toISOString(), avatar: 'LG', color: '#f43f5e', createdAt: '2024-03-20T11:00:00Z' },
  { id: 'u13', name: 'Kevin Lee', email: 'kevin.lee@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'away', lastActive: new Date(Date.now() - 3 * 3600000).toISOString(), avatar: 'KL', color: '#f97316', createdAt: '2024-03-22T08:00:00Z' },
  { id: 'u14', name: 'Rachel Green', email: 'rachel.green@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 12 * 60000).toISOString(), avatar: 'RG', color: '#eab308', createdAt: '2024-03-25T10:00:00Z' },
  { id: 'u15', name: 'Daniel Kim', email: 'daniel.kim@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'offline', lastActive: new Date(Date.now() - 72 * 3600000).toISOString(), avatar: 'DK', color: '#22c55e', createdAt: '2024-03-28T09:00:00Z' },
  { id: 'u16', name: 'Sophie Turner', email: 'sophie.turner@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 8 * 60000).toISOString(), avatar: 'ST', color: '#06b6d4', createdAt: '2024-04-01T11:00:00Z' },
  { id: 'u17', name: 'Mark Evans', email: 'mark.evans@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 18 * 60000).toISOString(), avatar: 'ME', color: '#6366f1', createdAt: '2024-04-05T08:00:00Z' },
  { id: 'u18', name: 'Nina Patel', email: 'nina.patel@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'away', lastActive: new Date(Date.now() - 4 * 3600000).toISOString(), avatar: 'NP', color: '#8b5cf6', createdAt: '2024-04-10T10:00:00Z' },
  { id: 'u19', name: 'Tom Harris', email: 'tom.harris@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'offline', lastActive: new Date(Date.now() - 96 * 3600000).toISOString(), avatar: 'TH', color: '#ec4899', createdAt: '2024-04-12T09:00:00Z' },
  { id: 'u20', name: 'Emma Watson', email: 'emma.watson@oneplace.com', department: 'Finance', role: 'viewer', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 25 * 60000).toISOString(), avatar: 'EW', color: '#f43f5e', createdAt: '2024-04-15T11:00:00Z' },
  { id: 'u21', name: 'Ryan Cooper', email: 'ryan.cooper@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 35 * 60000).toISOString(), avatar: 'RC', color: '#f97316', createdAt: '2024-04-18T08:00:00Z' },
  { id: 'u22', name: 'Jessica Alba', email: 'jessica.alba@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'offline', lastActive: new Date(Date.now() - 120 * 3600000).toISOString(), avatar: 'JA', color: '#eab308', createdAt: '2024-04-20T10:00:00Z' },
  { id: 'u23', name: 'Andrew Scott', email: 'andrew.scott@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 50 * 60000).toISOString(), avatar: 'AS', color: '#22c55e', createdAt: '2024-04-22T09:00:00Z' },
  { id: 'u24', name: 'Megan Fox', email: 'megan.fox@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'away', lastActive: new Date(Date.now() - 5 * 3600000).toISOString(), avatar: 'MF', color: '#06b6d4', createdAt: '2024-04-25T11:00:00Z' },
  { id: 'u25', name: 'Jason Bourne', email: 'jason.bourne@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 22 * 60000).toISOString(), avatar: 'JB', color: '#6366f1', createdAt: '2024-04-28T08:00:00Z' },
  { id: 'u26', name: 'Kate Winslet', email: 'kate.winslet@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 14 * 60000).toISOString(), avatar: 'KW', color: '#8b5cf6', createdAt: '2024-05-01T10:00:00Z' },
  { id: 'u27', name: 'Leonardo DiCaprio', email: 'leo.dicaprio@oneplace.com', department: 'Management', role: 'manager', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 7 * 60000).toISOString(), avatar: 'LD', color: '#ec4899', createdAt: '2024-05-05T09:00:00Z' },
  { id: 'u28', name: 'Jennifer Lawrence', email: 'jen.lawrence@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 16 * 60000).toISOString(), avatar: 'JL', color: '#f43f5e', createdAt: '2024-05-08T11:00:00Z' },
  { id: 'u29', name: 'Brad Pitt', email: 'brad.pitt@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'away', lastActive: new Date(Date.now() - 6 * 3600000).toISOString(), avatar: 'BP', color: '#f97316', createdAt: '2024-05-10T08:00:00Z' },
  { id: 'u30', name: 'Angelina Jolie', email: 'angie.jolie@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 40 * 60000).toISOString(), avatar: 'AJ', color: '#eab308', createdAt: '2024-05-12T10:00:00Z' },
  { id: 'u31', name: 'Johnny Depp', email: 'johnny.depp@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'offline', lastActive: new Date(Date.now() - 144 * 3600000).toISOString(), avatar: 'JD', color: '#22c55e', createdAt: '2024-05-15T09:00:00Z' },
  { id: 'u32', name: 'Scarlett Johansson', email: 'scarlett.j@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 11 * 60000).toISOString(), avatar: 'SJ2', color: '#06b6d4', createdAt: '2024-05-18T11:00:00Z' },
  { id: 'u33', name: 'Robert Downey', email: 'rdj@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 28 * 60000).toISOString(), avatar: 'RD', color: '#6366f1', createdAt: '2024-05-20T08:00:00Z' },
  { id: 'u34', name: 'Chris Evans', email: 'chris.evans@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'away', lastActive: new Date(Date.now() - 7 * 3600000).toISOString(), avatar: 'CE', color: '#8b5cf6', createdAt: '2024-05-22T10:00:00Z' },
  { id: 'u35', name: 'Chris Hemsworth', email: 'chris.h@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 19 * 60000).toISOString(), avatar: 'CH', color: '#ec4899', createdAt: '2024-05-25T09:00:00Z' },
  { id: 'u36', name: 'Mark Ruffalo', email: 'mark.r@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'offline', lastActive: new Date(Date.now() - 168 * 3600000).toISOString(), avatar: 'MR', color: '#f43f5e', createdAt: '2024-05-28T11:00:00Z' },
  { id: 'u37', name: 'Jeremy Renner', email: 'jeremy.r@oneplace.com', department: 'Finance', role: 'viewer', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 33 * 60000).toISOString(), avatar: 'JR', color: '#f97316', createdAt: '2024-06-01T08:00:00Z' },
  { id: 'u38', name: 'Samuel Jackson', email: 'sam.jackson@oneplace.com', department: 'Management', role: 'member', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 9 * 60000).toISOString(), avatar: 'SJ3', color: '#eab308', createdAt: '2024-06-05T10:00:00Z' },
  { id: 'u39', name: 'Brie Larson', email: 'brie.larson@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'away', lastActive: new Date(Date.now() - 8 * 3600000).toISOString(), avatar: 'BL', color: '#22c55e', createdAt: '2024-06-08T09:00:00Z' },
  { id: 'u40', name: 'Tom Holland', email: 'tom.holland@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 21 * 60000).toISOString(), avatar: 'TH2', color: '#06b6d4', createdAt: '2024-06-10T11:00:00Z' },
  { id: 'u41', name: 'Zendaya Coleman', email: 'zendaya@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 13 * 60000).toISOString(), avatar: 'ZC', color: '#6366f1', createdAt: '2024-06-12T08:00:00Z' },
  { id: 'u42', name: 'Jacob Batalon', email: 'jacob.b@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'offline', lastActive: new Date(Date.now() - 192 * 3600000).toISOString(), avatar: 'JB2', color: '#8b5cf6', createdAt: '2024-06-15T10:00:00Z' },
  { id: 'u43', name: 'Marisa Tomei', email: 'marisa.t@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 17 * 60000).toISOString(), avatar: 'MT', color: '#ec4899', createdAt: '2024-06-18T09:00:00Z' },
  { id: 'u44', name: 'Jon Favreau', email: 'jon.f@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'away', lastActive: new Date(Date.now() - 9 * 3600000).toISOString(), avatar: 'JF', color: '#f43f5e', createdAt: '2024-06-20T11:00:00Z' },
  { id: 'u45', name: 'Gwyneth Paltrow', email: 'gwyneth.p@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'online', lastActive: new Date(Date.now() - 44 * 60000).toISOString(), avatar: 'GP', color: '#f97316', createdAt: '2024-06-22T08:00:00Z' },
  { id: 'u46', name: 'Don Cheadle', email: 'don.c@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 26 * 60000).toISOString(), avatar: 'DC', color: '#eab308', createdAt: '2024-06-25T10:00:00Z' },
  { id: 'u47', name: 'Paul Rudd', email: 'paul.rudd@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'offline', lastActive: new Date(Date.now() - 216 * 3600000).toISOString(), avatar: 'PR', color: '#22c55e', createdAt: '2024-06-28T09:00:00Z' },
  { id: 'u48', name: 'Evangeline Lilly', email: 'evangeline.l@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 15 * 60000).toISOString(), avatar: 'EL', color: '#06b6d4', createdAt: '2024-07-01T11:00:00Z' },
  { id: 'u49', name: 'Michael Douglas', email: 'michael.d@oneplace.com', department: 'Management', role: 'viewer', team: 'Leadership', status: 'away', lastActive: new Date(Date.now() - 10 * 3600000).toISOString(), avatar: 'MD', color: '#6366f1', createdAt: '2024-07-03T08:00:00Z' },
  { id: 'u50', name: 'Michelle Pfeiffer', email: 'michelle.p@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 38 * 60000).toISOString(), avatar: 'MP', color: '#8b5cf6', createdAt: '2024-07-05T10:00:00Z' },
  { id: 'u51', name: 'Harrison Ford', email: 'harrison.f@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 27 * 60000).toISOString(), avatar: 'HF', color: '#ec4899', createdAt: '2024-07-08T09:00:00Z' },
  { id: 'u52', name: 'Karen Gillan', email: 'karen.g@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'offline', lastActive: new Date(Date.now() - 240 * 3600000).toISOString(), avatar: 'KG', color: '#f43f5e', createdAt: '2024-07-10T11:00:00Z' },
  { id: 'u53', name: 'Dave Bautista', email: 'dave.b@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 31 * 60000).toISOString(), avatar: 'DB', color: '#f97316', createdAt: '2024-07-12T08:00:00Z' },
  { id: 'u54', name: 'Pom Klementieff', email: 'pom.k@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'away', lastActive: new Date(Date.now() - 11 * 3600000).toISOString(), avatar: 'PK', color: '#eab308', createdAt: '2024-07-15T10:00:00Z' },
  { id: 'u55', name: 'Sean Gunn', email: 'sean.g@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'online', lastActive: new Date(Date.now() - 20 * 60000).toISOString(), avatar: 'SG', color: '#22c55e', createdAt: '2024-07-18T09:00:00Z' },
  { id: 'u56', name: 'Chadwick Boseman', email: 'chadwick.b@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 42 * 60000).toISOString(), avatar: 'CB', color: '#06b6d4', createdAt: '2024-07-20T11:00:00Z' },
  { id: 'u57', name: 'Lupita Nyongo', email: 'lupita.n@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'offline', lastActive: new Date(Date.now() - 264 * 3600000).toISOString(), avatar: 'LN', color: '#6366f1', createdAt: '2024-07-22T08:00:00Z' },
  { id: 'u58', name: 'Danai Gurira', email: 'danai.g@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 23 * 60000).toISOString(), avatar: 'DG', color: '#8b5cf6', createdAt: '2024-07-25T10:00:00Z' },
  { id: 'u59', name: 'Letitia Wright', email: 'letitia.w@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'away', lastActive: new Date(Date.now() - 12 * 3600000).toISOString(), avatar: 'LW', color: '#ec4899', createdAt: '2024-07-28T09:00:00Z' },
  { id: 'u60', name: 'Winston Duke', email: 'winston.d@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 29 * 60000).toISOString(), avatar: 'WD', color: '#f43f5e', createdAt: '2024-07-30T11:00:00Z' },
  { id: 'u61', name: 'Angela Bassett', email: 'angela.b@oneplace.com', department: 'Management', role: 'manager', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 6 * 60000).toISOString(), avatar: 'AB', color: '#f97316', createdAt: '2024-08-01T08:00:00Z' },
  { id: 'u62', name: 'Forest Whitaker', email: 'forest.w@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 36 * 60000).toISOString(), avatar: 'FW', color: '#eab308', createdAt: '2024-08-03T10:00:00Z' },
  { id: 'u63', name: 'Daniel Kaluuya', email: 'daniel.k@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'offline', lastActive: new Date(Date.now() - 288 * 3600000).toISOString(), avatar: 'DK2', color: '#22c55e', createdAt: '2024-08-05T09:00:00Z' },
  { id: 'u64', name: 'Martin Freeman', email: 'martin.f@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 24 * 60000).toISOString(), avatar: 'MF2', color: '#06b6d4', createdAt: '2024-08-08T11:00:00Z' },
  { id: 'u65', name: 'Andy Serkis', email: 'andy.s@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'away', lastActive: new Date(Date.now() - 13 * 3600000).toISOString(), avatar: 'AS2', color: '#6366f1', createdAt: '2024-08-10T08:00:00Z' },
  { id: 'u66', name: 'Florence Kasumba', email: 'florence.k@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 18 * 60000).toISOString(), avatar: 'FK', color: '#8b5cf6', createdAt: '2024-08-12T10:00:00Z' },
  { id: 'u67', name: 'John Kani', email: 'john.k@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'offline', lastActive: new Date(Date.now() - 312 * 3600000).toISOString(), avatar: 'JK', color: '#ec4899', createdAt: '2024-08-15T09:00:00Z' },
  { id: 'u68', name: 'Sterling Brown', email: 'sterling.b@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 32 * 60000).toISOString(), avatar: 'SB', color: '#f43f5e', createdAt: '2024-08-18T11:00:00Z' },
  { id: 'u69', name: 'Benedict Cumberbatch', email: 'benedict.c@oneplace.com', department: 'Management', role: 'administrator', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 4 * 60000).toISOString(), avatar: 'BC', color: '#f97316', createdAt: '2024-08-20T08:00:00Z' },
  { id: 'u70', name: 'Tilda Swinton', email: 'tilda.s@oneplace.com', department: 'Finance', role: 'viewer', team: 'Finance', status: 'away', lastActive: new Date(Date.now() - 14 * 3600000).toISOString(), avatar: 'TS', color: '#eab308', createdAt: '2024-08-22T10:00:00Z' },
  { id: 'u71', name: 'Benedict Wong', email: 'benedict.w@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'online', lastActive: new Date(Date.now() - 37 * 60000).toISOString(), avatar: 'BW', color: '#22c55e', createdAt: '2024-08-25T09:00:00Z' },
  { id: 'u72', name: 'Rachel McAdams', email: 'rachel.m@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 10 * 60000).toISOString(), avatar: 'RM', color: '#06b6d4', createdAt: '2024-08-28T11:00:00Z' },
  { id: 'u73', name: 'Mads Mikkelsen', email: 'mads.m@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'offline', lastActive: new Date(Date.now() - 336 * 3600000).toISOString(), avatar: 'MM', color: '#6366f1', createdAt: '2024-09-01T08:00:00Z' },
  { id: 'u74', name: 'Chiwetel Ejiofor', email: 'chiwetel.e@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 48 * 60000).toISOString(), avatar: 'CE2', color: '#8b5cf6', createdAt: '2024-09-03T10:00:00Z' },
  { id: 'u75', name: 'Michael Stuhlbarg', email: 'michael.s@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'away', lastActive: new Date(Date.now() - 15 * 3600000).toISOString(), avatar: 'MS', color: '#ec4899', createdAt: '2024-09-05T09:00:00Z' },
  { id: 'u76', name: 'Benjamin Bratt', email: 'benjamin.b@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'online', lastActive: new Date(Date.now() - 34 * 60000).toISOString(), avatar: 'BB', color: '#f43f5e', createdAt: '2024-09-08T11:00:00Z' },
  { id: 'u77', name: 'Scott Derrickson', email: 'scott.d@oneplace.com', department: 'Management', role: 'member', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 8 * 60000).toISOString(), avatar: 'SD', color: '#f97316', createdAt: '2024-09-10T08:00:00Z' },
  { id: 'u78', name: 'Zara Larsson', email: 'zara.l@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'offline', lastActive: new Date(Date.now() - 360 * 3600000).toISOString(), avatar: 'ZL', color: '#eab308', createdAt: '2024-09-12T10:00:00Z' },
  { id: 'u79', name: 'Tim Roth', email: 'tim.r@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'online', lastActive: new Date(Date.now() - 41 * 60000).toISOString(), avatar: 'TR', color: '#22c55e', createdAt: '2024-09-15T09:00:00Z' },
  { id: 'u80', name: 'William Hurt', email: 'william.h@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'away', lastActive: new Date(Date.now() - 16 * 3600000).toISOString(), avatar: 'WH', color: '#06b6d4', createdAt: '2024-09-18T11:00:00Z' },
  { id: 'u81', name: 'Rene Russo', email: 'rene.r@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 12 * 60000).toISOString(), avatar: 'RR', color: '#6366f1', createdAt: '2024-09-20T08:00:00Z' },
  { id: 'u82', name: 'Stellan Skarsgard', email: 'stellan.s@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 30 * 60000).toISOString(), avatar: 'SS', color: '#8b5cf6', createdAt: '2024-09-22T10:00:00Z' },
  { id: 'u83', name: 'Idris Elba', email: 'idris.e@oneplace.com', department: 'Engineering', role: 'team-lead', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 3 * 60000).toISOString(), avatar: 'IE', color: '#ec4899', createdAt: '2024-09-25T09:00:00Z' },
  { id: 'u84', name: 'Anthony Hopkins', email: 'anthony.h@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'offline', lastActive: new Date(Date.now() - 384 * 3600000).toISOString(), avatar: 'AH', color: '#f43f5e', createdAt: '2024-09-28T11:00:00Z' },
  { id: 'u85', name: 'Natalie Portman', email: 'natalie.p@oneplace.com', department: 'Management', role: 'manager', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 7 * 60000).toISOString(), avatar: 'NP2', color: '#f97316', createdAt: '2024-10-01T08:00:00Z' },
  { id: 'u86', name: 'Chris Pratt', email: 'chris.p@oneplace.com', department: 'Finance', role: 'member', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 39 * 60000).toISOString(), avatar: 'CP', color: '#eab308', createdAt: '2024-10-03T10:00:00Z' },
  { id: 'u87', name: 'Zoe Saldana', email: 'zoe.s@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'away', lastActive: new Date(Date.now() - 17 * 3600000).toISOString(), avatar: 'ZS', color: '#22c55e', createdAt: '2024-10-05T09:00:00Z' },
  { id: 'u88', name: 'Dave Bautista', email: 'dave.b2@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 43 * 60000).toISOString(), avatar: 'DB2', color: '#06b6d4', createdAt: '2024-10-08T11:00:00Z' },
  { id: 'u89', name: 'Vin Diesel', email: 'vin.d@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'online', lastActive: new Date(Date.now() - 11 * 60000).toISOString(), avatar: 'VD', color: '#6366f1', createdAt: '2024-10-10T08:00:00Z' },
  { id: 'u90', name: 'Bradley Cooper', email: 'bradley.c@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'offline', lastActive: new Date(Date.now() - 408 * 3600000).toISOString(), avatar: 'BC2', color: '#8b5cf6', createdAt: '2024-10-12T10:00:00Z' },
  { id: 'u91', name: 'Lee Pace', email: 'lee.p@oneplace.com', department: 'Engineering', role: 'member', team: 'Engineering', status: 'online', lastActive: new Date(Date.now() - 35 * 60000).toISOString(), avatar: 'LP', color: '#ec4899', createdAt: '2024-10-15T09:00:00Z' },
  { id: 'u92', name: 'Michael Rooker', email: 'michael.r@oneplace.com', department: 'Product', role: 'member', team: 'Product', status: 'away', lastActive: new Date(Date.now() - 18 * 3600000).toISOString(), avatar: 'MR2', color: '#f43f5e', createdAt: '2024-10-18T11:00:00Z' },
  { id: 'u93', name: 'Karen Gillan', email: 'karen.g2@oneplace.com', department: 'Management', role: 'member', team: 'Leadership', status: 'online', lastActive: new Date(Date.now() - 5 * 60000).toISOString(), avatar: 'KG2', color: '#f97316', createdAt: '2024-10-20T08:00:00Z' },
  { id: 'u94', name: 'Djimon Hounsou', email: 'djimon.h@oneplace.com', department: 'Finance', role: 'viewer', team: 'Finance', status: 'online', lastActive: new Date(Date.now() - 47 * 60000).toISOString(), avatar: 'DH', color: '#eab308', createdAt: '2024-10-22T10:00:00Z' },
  { id: 'u95', name: 'John C Reilly', email: 'john.c@oneplace.com', department: 'HR', role: 'member', team: 'HR', status: 'offline', lastActive: new Date(Date.now() - 432 * 3600000).toISOString(), avatar: 'JCR', color: '#22c55e', createdAt: '2024-10-25T09:00:00Z' },
  { id: 'u96', name: 'Glenn Close', email: 'glenn.c@oneplace.com', department: 'Marketing', role: 'member', team: 'Marketing', status: 'online', lastActive: new Date(Date.now() - 19 * 60000).toISOString(), avatar: 'GC', color: '#06b6d4', createdAt: '2024-10-28T11:00:00Z' },
  { id: 'u97', name: 'Benicio Del Toro', email: 'benicio.d@oneplace.com', department: 'Sales', role: 'member', team: 'Sales', status: 'away', lastActive: new Date(Date.now() - 19 * 3600000).toISOString(), avatar: 'BDT', color: '#6366f1', createdAt: '2024-11-01T08:00:00Z' },
  { id: 'u98', name: 'Josh Brolin', email: 'josh.b@oneplace.com', department: 'Support', role: 'member', team: 'Support', status: 'online', lastActive: new Date(Date.now() - 28 * 60000).toISOString(), avatar: 'JB3', color: '#8b5cf6', createdAt: '2024-11-03T10:00:00Z' }
];

const SAMPLE_TEAMS = [
  { id: 't1', name: 'Marketing', description: 'Brand strategy, campaigns, and content creation', icon: 'marketing', members: 18, projects: 12, color: '#f59e0b', lead: 'Sarah Johnson' },
  { id: 't2', name: 'Sales', description: 'Revenue generation and client relationships', icon: 'sales', members: 24, projects: 8, color: '#6366f1', lead: 'James Wilson' },
  { id: 't3', name: 'Engineering', description: 'Product development and technical infrastructure', icon: 'engineering', members: 32, projects: 15, color: '#8b5cf6', lead: 'Michael Brown' },
  { id: 't4', name: 'Support', description: 'Customer success and technical support', icon: 'support', members: 16, projects: 6, color: '#10b981', lead: 'Emily Davis' },
  { id: 't5', name: 'Product', description: 'Product strategy, design, and roadmap', icon: 'product', members: 14, projects: 10, color: '#0ea5e9', lead: 'Olivia Martinez' },
  { id: 't6', name: 'Leadership', description: 'Executive team and strategic planning', icon: 'sales', members: 6, projects: 4, color: '#6366f1', lead: 'Alex Morgan' }
];

const SAMPLE_DEPARTMENTS = [
  { id: 'd1', name: 'Sales', icon: 'sales', users: 28, teams: 1, lead: 'James Wilson', color: '#6366f1' },
  { id: 'd2', name: 'Support', icon: 'support', users: 24, teams: 1, lead: 'Emily Davis', color: '#10b981' },
  { id: 'd3', name: 'Marketing', icon: 'marketing', users: 18, teams: 1, lead: 'Sarah Johnson', color: '#f59e0b' },
  { id: 'd4', name: 'Product', icon: 'product', users: 16, teams: 1, lead: 'Olivia Martinez', color: '#0ea5e9' },
  { id: 'd5', name: 'Engineering', icon: 'engineering', users: 12, teams: 1, lead: 'Michael Brown', color: '#8b5cf6' },
  { id: 'd6', name: 'Finance', icon: 'finance', users: 12, teams: 1, lead: 'Lisa Anderson', color: '#ef4444' },
  { id: 'd7', name: 'HR', icon: 'hr', users: 8, teams: 1, lead: 'David Thompson', color: '#d946ef' },
  { id: 'd8', name: 'Other', icon: 'other', users: 8, teams: 1, lead: 'Alex Morgan', color: '#6b7280' }
];

const SAMPLE_ROLES = [
  { id: 'r1', name: 'Administrator', description: 'Full system access and management', icon: 'admin', users: 3, permissions: ['all'], color: '#ef4444' },
  { id: 'r2', name: 'Manager', description: 'Team management and reporting access', icon: 'manager', users: 5, permissions: ['read', 'write', 'manage'], color: '#6366f1' },
  { id: 'r3', name: 'Team Lead', description: 'Lead specific teams and projects', icon: 'lead', users: 4, permissions: ['read', 'write', 'lead'], color: '#f59e0b' },
  { id: 'r4', name: 'Member', description: 'Standard team member access', icon: 'member', users: 54, permissions: ['read', 'write'], color: '#10b981' },
  { id: 'r5', name: 'Viewer', description: 'Read-only access to resources', icon: 'viewer', users: 12, permissions: ['read'], color: '#6b7280' }
];

const SAMPLE_PERMISSIONS = [
  { resource: 'Dashboard', icon: 'ph-squares-four', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'Users', icon: 'ph-users', admin: true, manager: true, lead: false, member: false, viewer: false },
  { resource: 'Teams', icon: 'ph-users-three', admin: true, manager: true, lead: true, member: false, viewer: false },
  { resource: 'Departments', icon: 'ph-buildings', admin: true, manager: true, lead: false, member: false, viewer: false },
  { resource: 'Roles', icon: 'ph-shield', admin: true, manager: false, lead: false, member: false, viewer: false },
  { resource: 'Permissions', icon: 'ph-key', admin: true, manager: false, lead: false, member: false, viewer: false },
  { resource: 'Invitations', icon: 'ph-envelope-simple', admin: true, manager: true, lead: false, member: false, viewer: false },
  { resource: 'Settings', icon: 'ph-gear', admin: true, manager: false, lead: false, member: false, viewer: false },
  { resource: 'Reports', icon: 'ph-chart-bar', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'Analytics', icon: 'ph-chart-line-up', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'CRM', icon: 'ph-users', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'Calendar', icon: 'ph-calendar', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'Tasks', icon: 'ph-check-circle', admin: true, manager: true, lead: true, member: true, viewer: true },
  { resource: 'Files', icon: 'ph-folder', admin: true, manager: true, lead: true, member: true, viewer: false },
  { resource: 'Billing', icon: 'ph-credit-card', admin: true, manager: false, lead: false, member: false, viewer: false }
];

const SAMPLE_INVITATIONS = [
  { id: 'inv1', email: 'david@example.com', role: 'Sales Manager', department: 'Sales', team: 'Sales', status: 'pending', sentAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'inv2', email: 'lisa@example.com', role: 'Marketing Specialist', department: 'Marketing', team: 'Marketing', status: 'pending', sentAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'inv3', email: 'robert@example.com', role: 'Developer', department: 'Engineering', team: 'Engineering', status: 'pending', sentAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'inv4', email: 'anna@example.com', role: 'Support Agent', department: 'Support', team: 'Support', status: 'pending', sentAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'inv5', email: 'tom@example.com', role: 'Account Manager', department: 'Sales', team: 'Sales', status: 'pending', sentAt: new Date(Date.now() - 6 * 86400000).toISOString() }
];

const SAMPLE_ACTIVITY = [
  { id: 'a1', user: 'Sarah Johnson', avatar: 'SJ', color: '#8b5cf6', action: 'Created new task "Marketing Campaign"', time: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'a2', user: 'Michael Brown', avatar: 'MB', color: '#ec4899', action: 'Updated user role for John Smith', time: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'a3', user: 'Emily Davis', avatar: 'ED', color: '#f43f5e', action: 'Added new team member', time: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'a4', user: 'James Wilson', avatar: 'JW', color: '#f97316', action: 'Invited 3 new users', time: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'a5', user: 'Olivia Martinez', avatar: 'OM', color: '#eab308', action: 'Updated department "Product"', time: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'a6', user: 'Alex Morgan', avatar: 'AM', color: '#6366f1', action: 'Changed permissions for Managers', time: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'a7', user: 'David Thompson', avatar: 'DT', color: '#22c55e', action: 'Created new role "Analyst"', time: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 'a8', user: 'Lisa Anderson', avatar: 'LA', color: '#06b6d4', action: 'Exported user list', time: new Date(Date.now() - 12 * 3600000).toISOString() }
];

// ============================================
// Team Storage
// ============================================

class TeamStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_USERS)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_TEAMS)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_TEAMS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_DEPARTMENTS)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_DEPARTMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_ROLES)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_ROLES, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_PERMISSIONS)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_PERMISSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_INVITATIONS)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_INVITATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TEAM_STORAGE_KEYS.TEAM_ACTIVITY)) {
      localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_ACTIVITY, JSON.stringify([]));
    }
  }

  readArray(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') {
        return Array.isArray(value.items) ? value.items : fallback;
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  getUsers() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_USERS, []);
  }

  saveUsers(users) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_USERS, JSON.stringify(users));
  }

  getTeams() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_TEAMS, []);
  }

  saveTeams(teams) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_TEAMS, JSON.stringify(teams));
  }

  getDepartments() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_DEPARTMENTS, []);
  }

  saveDepartments(depts) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_DEPARTMENTS, JSON.stringify(depts));
  }

  getRoles() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_ROLES, []);
  }

  saveRoles(roles) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_ROLES, JSON.stringify(roles));
  }

  getPermissions() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_PERMISSIONS, []);
  }

  savePermissions(perms) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_PERMISSIONS, JSON.stringify(perms));
  }

  getInvitations() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_INVITATIONS, []);
  }

  saveInvitations(invites) {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_INVITATIONS, JSON.stringify(invites));
  }

  getActivity() {
    return this.readArray(TEAM_STORAGE_KEYS.TEAM_ACTIVITY, []);
  }

  addActivity(activity) {
    const activities = this.getActivity();
    activities.unshift({
      id: `a${Date.now()}`,
      ...activity,
      time: new Date().toISOString()
    });
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAM_ACTIVITY, JSON.stringify(activities.slice(0, 50)));
  }

  getStats() {
    const users = this.getUsers();
    const teams = this.getTeams();
    const depts = this.getDepartments();
    const roles = this.getRoles();

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'online').length,
      totalTeams: teams.length,
      totalDepartments: depts.length,
      totalRoles: roles.length
    };
  }
}

// ============================================
// Team App
// ============================================

class TeamApp {
  constructor() {
    this.storage = new TeamStorage();
    this.currentTab = 'users';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.currentSearch = '';
    this.selectedItems = new Set();
    this.sortField = 'name';
    this.sortDir = 'asc';
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.renderStats();
    this.renderCharts();
    this.renderTable();
    this.renderSidebarContent();
    this.bindEvents();
    this.syncFromBackend();
  }

  async syncFromBackend() {
    if (!window.OP || !window.OP.apiIntegration) return;

    try {
      window.OP.apiIntegration.init();
      const response = await window.OP.apiIntegration.get('/users?limit=100').catch(() => null);
      const payload = response ? window.OP.apiIntegration.extractData(response) : null;
      const users = Array.isArray(payload?.users)
        ? payload.users
        : window.OP.apiIntegration.extractArray(response);

      if (!users.length) return;

      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#22c55e', '#06b6d4', '#eab308'];
      const normalizedUsers = users.map((user, index) => {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.name || user.email || `User ${index + 1}`;
        const initials = fullName.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);
        const role = String(user.role || user.roles?.[0] || user.userRole || 'member').toLowerCase();
        const department = user.department || user.team || user.organization?.name || 'Other';
        return {
          id: user.id || user.userId || `u_${index + 1}`,
          name: fullName,
          email: user.email || '',
          department,
          role,
          team: user.team || department,
          status: user.isActive === false ? 'offline' : 'online',
          lastActive: user.lastActiveAt || user.updatedAt || new Date().toISOString(),
          avatar: initials,
          color: user.color || colors[index % colors.length],
          createdAt: user.createdAt || new Date().toISOString()
        };
      });

      this.storage.saveUsers(normalizedUsers);

      const departments = Array.from(new Set(normalizedUsers.map((u) => u.department))).map((name, idx) => ({
        id: `d${idx + 1}`,
        name,
        icon: 'department',
        users: normalizedUsers.filter((u) => u.department === name).length,
        teams: 1,
        lead: normalizedUsers.find((u) => u.department === name)?.name || 'Team Lead',
        color: colors[idx % colors.length]
      }));
      this.storage.saveDepartments(departments);

      const teams = Array.from(new Set(normalizedUsers.map((u) => u.team))).map((name, idx) => ({
        id: `t${idx + 1}`,
        name,
        description: `${name} team`,
        icon: 'team',
        members: normalizedUsers.filter((u) => u.team === name).length,
        projects: 0,
        color: colors[idx % colors.length],
        lead: normalizedUsers.find((u) => u.team === name)?.name || 'Team Lead'
      }));
      this.storage.saveTeams(teams);

      const roles = Array.from(new Set(normalizedUsers.map((u) => u.role))).map((name, idx) => ({
        id: `r${idx + 1}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        description: 'Backend-synced role',
        icon: 'role',
        users: normalizedUsers.filter((u) => u.role === name).length,
        permissions: ['read'],
        color: colors[idx % colors.length]
      }));
      this.storage.saveRoles(roles);

      this.renderStats();
      this.renderCharts();
      this.renderTable();
      this.renderSidebarContent();
    } catch (error) {
      console.warn('Team backend sync skipped:', error);
    }
  }

  // ============================================
  // Sidebar Rendering
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const sidebarNav = sidebar.querySelector('.sidebar-nav');
    if (!sidebarNav) return;

    const existingHeader = sidebar.querySelector('.sidebar-header');
    if (!existingHeader) {
      const header = document.createElement('div');
      header.className = 'sidebar-header';
      header.innerHTML = `
        <a href="../index.html" class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise</span>
          </div>
        </a>
      `;
      sidebar.insertBefore(header, sidebarNav);
    }

    const existingFooter = sidebar.querySelector('.sidebar-footer');
    if (!existingFooter) {
      const footer = document.createElement('div');
      footer.className = 'sidebar-footer';
      footer.innerHTML = `
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">Administrator</div>
          </div>
        </div>
      `;
      sidebar.appendChild(footer);
    }

    if (sidebarNav.querySelector('[data-nav-section="global"]')) {
      return;
    }

    const navSection = document.createElement('div');
    navSection.className = 'sidebar-section';
    navSection.setAttribute('data-nav-section', 'global');
    navSection.innerHTML = `
      <div class="sidebar-section-title">Navigation</div>
      <a href="../dashboard/main-dashboard.html" class="sidebar-item" data-page="main-dashboard"><i class="ph ph-squares-four"></i><span>Dashboard</span></a>
      <a href="../inbox/unified-inbox.html" class="sidebar-item" data-page="unified-inbox"><i class="ph ph-envelope"></i><span>All Inbox</span></a>
      <a href="../reports/index.html" class="sidebar-item" data-page="reports"><i class="ph ph-chart-bar"></i><span>Reports</span></a>
      <a href="../crm/index.html" class="sidebar-item" data-page="crm"><i class="ph ph-users"></i><span>CRM</span></a>
      <a href="../calendar/index.html" class="sidebar-item" data-page="calendar"><i class="ph ph-calendar-blank"></i><span>Calendar</span></a>
      <a href="../tasks/index.html" class="sidebar-item" data-page="tasks"><i class="ph ph-check-square"></i><span>Tasks</span></a>
      <a href="index.html" class="sidebar-item active" data-page="team-management"><i class="ph ph-users-three"></i><span>Team</span></a>
      <a href="../workflow/index.html" class="sidebar-item" data-page="workflow"><i class="ph ph-flow-arrow"></i><span>Workflow</span></a>
      <a href="../files/index.html" class="sidebar-item" data-page="files"><i class="ph ph-folder"></i><span>Files</span></a>
      <a href="../integrations/index.html" class="sidebar-item" data-page="integrations"><i class="ph ph-plugs-connected"></i><span>Integrations</span></a>
      <a href="../settings/index.html" class="sidebar-item" data-page="settings"><i class="ph ph-gear"></i><span>Settings</span></a>
      <a href="../help/index.html" class="sidebar-item" data-page="help"><i class="ph ph-question"></i><span>Help &amp; Support</span></a>
    `;
    sidebarNav.appendChild(navSection);

    const currentUrl = window.location.href;
    sidebarNav.querySelectorAll('a.sidebar-item').forEach(link => {
      const href = link.getAttribute('href') || '';
      const isActive = href === 'index.html' ? currentUrl.endsWith('/team/index.html') || currentUrl.endsWith('/team/') : currentUrl.endsWith(href);
      link.classList.toggle('active', isActive);
    });
  }

  // ============================================
  // Header Rendering
  // ============================================
  renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'Alex Morgan';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    header.innerHTML = `
      <div class="header-left">
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
          <i class="ph ph-list"></i>
        </button>
      </div>
      <div class="header-right">
        <div class="header-avatar" id="user-menu-btn" title="${userName}">
          ${initials}
        </div>
      </div>
    `;
  }

  // ============================================
  // Stats Row
  // ============================================
  renderStats() {
    const stats = this.storage.getStats();
    const container = document.getElementById('team-stats-row');

    const statCards = [
      { label: 'Total Users', value: stats.totalUsers, icon: 'users', iconClass: 'users', trend: 16, trendDir: 'up' },
      { label: 'Active Users', value: stats.activeUsers, icon: 'active', iconClass: 'active', trend: 12, trendDir: 'up' },
      { label: 'Teams', value: stats.totalTeams, icon: 'teams', iconClass: 'teams', trend: 9, trendDir: 'up' },
      { label: 'Departments', value: stats.totalDepartments, icon: 'depts', iconClass: 'depts', trend: 8, trendDir: 'up' },
      { label: 'Roles', value: stats.totalRoles, icon: 'roles', iconClass: 'roles', trend: 0, trendDir: 'up' }
    ];

    let html = '';
    statCards.forEach(stat => {
      const trendIcon = stat.trendDir === 'up' ? 'ph-trend-up' : 'ph-trend-down';
      const trendClass = stat.trendDir === 'up' ? 'up' : 'down';
      const iconMap = {
        users: 'ph-users',
        active: 'ph-user-check',
        teams: 'ph-users-three',
        depts: 'ph-buildings',
        roles: 'ph-shield-check'
      };

      html += `
        <div class="team-stat-card">
          <div class="team-stat-header">
            <div class="team-stat-icon ${stat.iconClass}"><i class="ph ${iconMap[stat.icon]}"></i></div>
            <span class="team-stat-trend ${trendClass}"><i class="ph ${trendIcon}"></i> ${stat.trend}%</span>
          </div>
          <div class="team-stat-value">${stat.value}</div>
          <div class="team-stat-label">vs last 7 days</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================
  // Charts
  // ============================================
  renderCharts() {
    this.renderTeamOverviewDonut();
    this.renderUserActivityChart();
    this.renderUsersByRoleDonut();
  }

  renderTeamOverviewDonut() {
    const users = this.storage.getUsers();
    const depts = this.storage.getDepartments();
    const data = depts.map(d => {
      const count = users.filter(u => u.department === d.name).length;
      return { label: d.name, value: count, color: d.color };
    }).filter(d => d.value > 0);

    this.createDonutChart('team-overview-donut', data, 'Total Users');
  }

  renderUsersByRoleDonut() {
    const users = this.storage.getUsers();
    const roles = this.storage.getRoles();
    const data = roles.map(r => {
      const count = users.filter(u => u.role === r.id || u.role === r.name.toLowerCase().replace(' ', '-')).length;
      return { label: r.name, value: count, color: r.color };
    }).filter(d => d.value > 0);

    this.createDonutChart('users-by-role-donut', data, 'Total Users');
  }

  renderUserActivityChart() {
    const container = document.getElementById('user-activity-chart');
    if (!container) return;

    const days = ['May 19', 'May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25'];
    const data = days.map((date, i) => ({
      date,
      value: [45, 52, 48, 65, 58, 72, 85][i]
    }));

    const width = container.clientWidth || 500;
    const height = 180;
    const padding = { top: 10, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.value));

    let svgHtml = `<svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxValue * (1 - i / 4));
      svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-dasharray="4" stroke-width="1"/>`;
      svgHtml += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--gray-400)">${val}</text>`;
    }

    // X axis labels
    const stepX = chartWidth / (data.length - 1);
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      svgHtml += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d.date}</text>`;
    });

    // Area fill
    let areaD = `M ${padding.left} ${padding.top + chartHeight}`;
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      areaD += ` L ${x} ${y}`;
    });
    areaD += ` L ${padding.left + (data.length - 1) * stepX} ${padding.top + chartHeight} Z`;
    svgHtml += `<path d="${areaD}" fill="rgba(99, 102, 241, 0.1)" stroke="none"/>`;

    // Line
    let pathD = '';
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      pathD += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });
    svgHtml += `<path d="${pathD}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Dots
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      svgHtml += `<circle cx="${x}" cy="${y}" r="4" fill="#6366f1" stroke="white" stroke-width="2"/>`;
    });

    svgHtml += '</svg>';
    container.innerHTML = svgHtml;
  }

  createDonutChart(containerId, data, totalLabel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;
    const segments = [];

    data.forEach((d, i) => {
      const percent = (d.value / total) * 100;
      const startAngle = cumulativePercent * 3.6;
      const endAngle = (cumulativePercent + percent) * 3.6;
      cumulativePercent += percent;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      const r = 50;
            const cx = 60;
      const cy = 60;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      segments.push({
        path,
        color: d.color,
        label: d.label,
        value: d.value,
        percent: percent.toFixed(1)
      });
    });

    // Build donut chart HTML
    let svgHtml = `<svg class="donut-chart-svg" viewBox="0 0 120 120" width="120" height="120">`;
    segments.forEach((seg, i) => {
      svgHtml += `<path d="${seg.path}" fill="${seg.color}" stroke="white" stroke-width="2"/>`;
    });
    svgHtml += `<circle cx="60" cy="60" r="32" fill="var(--gray-0)"/>`;
    svgHtml += `</svg>`;

    let legendHtml = `<div class="donut-legend">`;
    segments.forEach(seg => {
      legendHtml += `
        <div class="donut-legend-item">
          <span class="donut-legend-color" style="background: ${seg.color}"></span>
          <span class="donut-legend-label">${seg.label}</span>
          <span class="donut-legend-value">${seg.value}</span>
        </div>
      `;
    });
    legendHtml += `</div>`;

    container.innerHTML = `
      <div class="donut-chart-wrapper">
        ${svgHtml}
        <div class="donut-chart-center">
          <div class="donut-chart-value">${total}</div>
          <div class="donut-chart-label">${totalLabel}</div>
        </div>
      </div>
      ${legendHtml}
    `;
  }

  // ============================================
  // Table Rendering
  // ============================================
  renderTable() {
    const container = document.getElementById('team-table-container');
    if (!container) return;

    switch (this.currentTab) {
      case 'users':
        this.renderUsersTable(container);
        break;
      case 'teams':
        this.renderTeamsGrid(container);
        break;
      case 'departments':
        this.renderDepartmentsGrid(container);
        break;
      case 'roles':
        this.renderRolesGrid(container);
        break;
      case 'permissions':
        this.renderPermissionsMatrix(container);
        break;
    }
  }

  renderUsersTable(container) {
    let users = this.storage.getUsers();
    
    // Search filter
    if (this.currentSearch) {
      const q = this.currentSearch.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }

    // Sort
    users.sort((a, b) => {
      let valA = a[this.sortField] || '';
      let valB = b[this.sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedUsers = users.slice(start, start + this.itemsPerPage);

    let html = `
      <table class="team-table">
        <thead>
          <tr>
            <th class="checkbox-cell"><input type="checkbox" id="select-all"></th>
            <th data-sort="name">User <i class="ph ph-caret-up-down"></i></th>
            <th data-sort="role">Role <i class="ph ph-caret-up-down"></i></th>
            <th data-sort="department">Department <i class="ph ph-caret-up-down"></i></th>
            <th data-sort="team">Team <i class="ph ph-caret-up-down"></i></th>
            <th data-sort="status">Status <i class="ph ph-caret-up-down"></i></th>
            <th data-sort="lastActive">Last Active <i class="ph ph-caret-up-down"></i></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
    `;

    if (paginatedUsers.length === 0) {
      html += `
        <tr>
          <td colspan="8">
            <div class="team-empty-state">
              <div class="team-empty-state-icon"><i class="ph ph-users"></i></div>
              <div class="team-empty-state-title">No users found</div>
              <div class="team-empty-state-desc">Try adjusting your search or filters</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      paginatedUsers.forEach(user => {
        const statusClass = user.status;
        const roleClass = user.role.toLowerCase().replace(' ', '-');
        const timeAgo = this.timeAgo(new Date(user.lastActive));
        
        html += `
          <tr data-id="${user.id}">
            <td class="checkbox-cell"><input type="checkbox" value="${user.id}"></td>
            <td>
              <div class="team-user-cell">
                <div class="team-user-avatar" style="background: ${user.color}">${user.avatar}</div>
                <div class="team-user-info">
                  <span class="team-user-name">${user.name}</span>
                  <span class="team-user-role">${user.email}</span>
                </div>
              </div>
            </td>
            <td><span class="team-role-badge ${roleClass}">${this.capitalize(user.role)}</span></td>
            <td><span class="team-dept-badge">${user.department}</span></td>
            <td>${user.team}</td>
            <td><span class="team-status-badge ${statusClass}">${this.capitalize(user.status)}</span></td>
            <td>${timeAgo}</td>
            <td>
              <button class="team-action-btn" data-action="edit" title="Edit"><i class="ph ph-pencil-simple"></i></button>
              <button class="team-action-btn" data-action="delete" title="Delete"><i class="ph ph-trash"></i></button>
            </td>
          </tr>
        `;
      });
    }

    html += `</tbody></table>`;
    container.innerHTML = html;

    this.renderPagination(totalItems, totalPages);
  }

  renderTeamsGrid(container) {
    const teams = this.storage.getTeams();
    
    let html = `<div class="team-cards-grid">`;
    teams.forEach(team => {
      const users = this.storage.getUsers().filter(u => u.team === team.name);
      const memberAvatars = users.slice(0, 4).map(u => 
        `<div class="team-card-member-avatar" style="background: ${u.color}">${u.avatar}</div>`
      ).join('');
      const moreCount = users.length - 4;
      const moreHtml = moreCount > 0 ? `<div class="team-card-member-more">+${moreCount}</div>` : '';

      html += `
        <div class="team-card" data-id="${team.id}">
          <div class="team-card-header">
            <div class="team-card-icon ${team.icon}"><i class="ph ph-users-three"></i></div>
            <button class="team-card-menu"><i class="ph ph-dots-three"></i></button>
          </div>
          <div class="team-card-title">${team.name}</div>
          <div class="team-card-desc">${team.description}</div>
          <div class="team-card-stats">
            <div class="team-card-stat">
              <span class="team-card-stat-value">${users.length}</span>
              <span class="team-card-stat-label">Members</span>
            </div>
            <div class="team-card-stat">
              <span class="team-card-stat-value">${team.projects}</span>
              <span class="team-card-stat-label">Projects</span>
            </div>
          </div>
          <div class="team-card-members">
            ${memberAvatars}${moreHtml}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.renderPagination(teams.length, 1);
  }

  renderDepartmentsGrid(container) {
    const depts = this.storage.getDepartments();
    const users = this.storage.getUsers();

    let html = `<div class="dept-cards-grid">`;
    depts.forEach(dept => {
      const deptUsers = users.filter(u => u.department === dept.name);
      const activeUsers = deptUsers.filter(u => u.status === 'online').length;
      const teams = this.storage.getTeams().filter(t => t.lead && deptUsers.some(u => u.name === t.lead));

      html += `
        <div class="dept-card" data-id="${dept.id}">
          <div class="dept-card-header">
            <div class="dept-card-icon ${dept.icon}"><i class="ph ph-buildings"></i></div>
            <div>
              <div class="dept-card-title">${dept.name}</div>
              <div class="dept-card-sub">Led by ${dept.lead}</div>
            </div>
          </div>
          <div class="dept-card-body">
            <div class="dept-card-metric">
              <div class="dept-card-metric-value">${deptUsers.length}</div>
              <div class="dept-card-metric-label">Users</div>
            </div>
            <div class="dept-card-metric">
              <div class="dept-card-metric-value">${activeUsers}</div>
              <div class="dept-card-metric-label">Active</div>
            </div>
            <div class="dept-card-metric">
              <div class="dept-card-metric-value">${teams.length}</div>
              <div class="dept-card-metric-label">Teams</div>
            </div>
          </div>
          <div class="dept-card-footer">
            <div class="dept-card-lead">
              <div class="team-user-avatar" style="background: ${dept.color}; width: 24px; height: 24px; font-size: 10px;">
                ${dept.lead.split(' ').map(n => n[0]).join('')}
              </div>
              <span>${dept.lead}</span>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.renderPagination(depts.length, 1);
  }

  renderRolesGrid(container) {
    const roles = this.storage.getRoles();
    const users = this.storage.getUsers();

    let html = `<div class="role-cards-grid">`;
    roles.forEach(role => {
      const roleUsers = users.filter(u => 
        u.role === role.id || 
        u.role === role.name.toLowerCase().replace(' ', '-')
      );
      const iconMap = {
        admin: 'ph-shield-check',
        manager: 'ph-user-gear',
        lead: 'ph-crown',
        member: 'ph-user',
        viewer: 'ph-eye'
      };

      html += `
        <div class="role-card" data-id="${role.id}">
          <div class="role-card-header">
            <div class="role-card-icon ${role.icon}"><i class="ph ${iconMap[role.icon] || 'ph-user'}"></i></div>
            <button class="team-card-menu"><i class="ph ph-dots-three"></i></button>
          </div>
          <div class="role-card-title">${role.name}</div>
          <div class="role-card-desc">${role.description}</div>
          <div class="role-card-perms">
            ${role.permissions.map(p => `<span class="role-card-perm">${this.capitalize(p)}</span>`).join('')}
          </div>
          <div style="margin-top: var(--space-3); font-size: var(--text-xs); color: var(--gray-500);">
            ${roleUsers.length} users assigned
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.renderPagination(roles.length, 1);
  }

  renderPermissionsMatrix(container) {
    const perms = this.storage.getPermissions();
    const roles = ['Admin', 'Manager', 'Lead', 'Member', 'Viewer'];

    let html = `<div class="perm-matrix">`;
    html += `
      <div class="perm-matrix-header">
        <div>Resource</div>
        ${roles.map(r => `<div>${r}</div>`).join('')}
      </div>
    `;

    perms.forEach(perm => {
      html += `
        <div class="perm-matrix-row">
          <div class="perm-matrix-resource">
            <i class="ph ${perm.icon}"></i>
            ${perm.resource}
          </div>
          <div class="perm-matrix-cell"><input type="checkbox" class="perm-toggle" ${perm.admin ? 'checked' : ''} disabled></div>
          <div class="perm-matrix-cell"><input type="checkbox" class="perm-toggle" ${perm.manager ? 'checked' : ''} disabled></div>
          <div class="perm-matrix-cell"><input type="checkbox" class="perm-toggle" ${perm.lead ? 'checked' : ''} disabled></div>
          <div class="perm-matrix-cell"><input type="checkbox" class="perm-toggle" ${perm.member ? 'checked' : ''} disabled></div>
          <div class="perm-matrix-cell"><input type="checkbox" class="perm-toggle" ${perm.viewer ? 'checked' : ''} disabled></div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.renderPagination(perms.length, 1);
  }

  renderPagination(totalItems, totalPages) {
    const container = document.getElementById('team-pagination');
    if (!container) return;

    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);

    let html = `
      <div class="team-pagination-info">
        Showing ${totalItems > 0 ? start : 0} to ${end} of ${totalItems} entries
      </div>
      <div class="team-pagination-nav">
        <button class="team-pagination-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>
          <i class="ph ph-caret-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        html += `<button class="team-pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<span class="team-pagination-btn" style="cursor: default;">...</span>`;
      }
    }

    html += `
        <button class="team-pagination-btn" data-page="next" ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>
          <i class="ph ph-caret-right"></i>
        </button>
      </div>
    `;

    container.innerHTML = html;
  }

  // ============================================
  // Right Sidebar Content
  // ============================================
  renderSidebarContent() {
    this.renderRecentActivity();
    this.renderPendingInvites();
    this.renderUsersByDept();
    this.renderQuickActions();
  }

  renderRecentActivity() {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;

    const activities = this.storage.getActivity().slice(0, 6);
    
    let html = '';
    activities.forEach(act => {
      const timeAgo = this.timeAgo(new Date(act.time));
      html += `
        <div class="team-activity-item">
          <div class="team-activity-avatar" style="background: ${act.color}">${act.avatar}</div>
          <div class="team-activity-content">
            <div class="team-activity-title"><strong>${act.user}</strong> ${act.action}</div>
            <div class="team-activity-time">${timeAgo}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderPendingInvites() {
    const container = document.getElementById('pending-invites-list');
    if (!container) return;

    const invites = this.storage.getInvitations().filter(i => i.status === 'pending').slice(0, 4);

    let html = '';
    invites.forEach(inv => {
      html += `
        <div class="team-invite-item">
          <div class="team-activity-avatar" style="background: var(--gray-200); color: var(--gray-600);">
            <i class="ph ph-envelope" style="font-size: 14px;"></i>
          </div>
          <div class="team-invite-info">
            <div class="team-invite-email">${inv.email}</div>
            <div class="team-invite-role">${inv.role} · ${inv.department}</div>
          </div>
          <button class="team-invite-action" data-id="${inv.id}">Resend</button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderUsersByDept() {
    const container = document.getElementById('users-by-dept-list');
    if (!container) return;

    const users = this.storage.getUsers();
    const depts = this.storage.getDepartments();
    const maxCount = Math.max(...depts.map(d => d.users));

    let html = '';
    depts.slice(0, 5).forEach(dept => {
      const percent = (dept.users / maxCount) * 100;
      html += `
        <div class="team-dept-item">
          <div style="flex: 1;">
            <div class="team-dept-info">
              <span class="team-dept-name">${dept.name}</span>
              <span class="team-dept-count">${dept.users}</span>
            </div>
            <div class="team-dept-bar-bg">
              <div class="team-dept-bar-fill" style="width: ${percent}%; background: ${dept.color};"></div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderQuickActions() {
    const container = document.getElementById('quick-actions-grid');
    if (!container) return;

    const actions = [
      { label: 'Invite User', icon: 'ph-user-plus', class: 'invite', action: 'invite' },
      { label: 'Create Team', icon: 'ph-users-three', class: 'create-team', action: 'create-team' },
      { label: 'Add Dept', icon: 'ph-buildings', class: 'create-dept', action: 'create-dept' },
      { label: 'Assign Role', icon: 'ph-shield-check', class: 'assign', action: 'assign' },
      { label: 'Manage Roles', icon: 'ph-key', class: 'roles', action: 'roles' },
      { label: 'Permissions', icon: 'ph-lock-key', class: 'perms', action: 'perms' },
      { label: 'Import Users', icon: 'ph-upload-simple', class: 'import', action: 'import' },
      { label: 'View Logs', icon: 'ph-clock-counter-clockwise', class: 'log', action: 'logs' }
    ];

    let html = '';
    actions.forEach(act => {
      html += `
        <button class="team-quick-action-btn" data-action="${act.action}">
          <div class="team-quick-action-icon ${act.class}"><i class="ph ${act.icon}"></i></div>
          <span>${act.label}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Tab switching
    document.getElementById('team-tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.team-tab');
      if (!tab) return;
      
      document.querySelectorAll('.team-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.currentTab = tab.dataset.tab;
      this.currentPage = 1;
      this.currentSearch = '';
      document.getElementById('table-search').value = '';
      this.renderTable();
    });

    // Table search
    document.getElementById('table-search')?.addEventListener('input', (e) => {
      this.currentSearch = e.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    // Global search
    document.getElementById('team-search')?.addEventListener('input', (e) => {
      this.currentSearch = e.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    // Pagination
    document.getElementById('team-pagination')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.team-pagination-btn');
      if (!btn || btn.disabled) return;

      const page = btn.dataset.page;
      const totalPages = Math.ceil(this.storage.getUsers().length / this.itemsPerPage);

      if (page === 'prev' && this.currentPage > 1) {
        this.currentPage--;
      } else if (page === 'next' && this.currentPage < totalPages) {
        this.currentPage++;
      } else if (page !== 'prev' && page !== 'next') {
        this.currentPage = parseInt(page);
      }
      this.renderTable();
    });

    // Sorting
    document.querySelector('.team-table')?.addEventListener('click', (e) => {
      const th = e.target.closest('th[data-sort]');
      if (!th) return;

      const field = th.dataset.sort;
      if (this.sortField === field) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDir = 'asc';
      }
      this.renderTable();
    });

    // Select all checkbox
    document.getElementById('team-table-container')?.addEventListener('change', (e) => {
      if (e.target.id === 'select-all') {
        const checkboxes = document.querySelectorAll('.team-table tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
      }
    });

    // Invite modal
    document.getElementById('btn-invite-user')?.addEventListener('click', () => {
      this.openModal('invite-modal-overlay');
      this.populateInviteForm();
    });

    document.getElementById('invite-modal-close')?.addEventListener('click', () => {
      this.closeModal('invite-modal-overlay');
    });

    document.getElementById('invite-modal-cancel')?.addEventListener('click', () => {
      this.closeModal('invite-modal-overlay');
    });

    document.getElementById('invite-modal-send')?.addEventListener('click', () => {
      this.sendInvitation();
    });

    // Quick actions
    document.getElementById('quick-actions-grid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.team-quick-action-btn');
      if (!btn) return;
      
      const action = btn.dataset.action;
      if (action === 'invite') {
        this.openModal('invite-modal-overlay');
        this.populateInviteForm();
      }
    });

    // Chart filter buttons
    document.querySelectorAll('.team-chart-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.team-chart-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // In a real app, this would fetch new data for the selected period
        this.renderUserActivityChart();
      });
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-overlay')?.classList.toggle('active');
    });

    document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.remove('open');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('team-search')?.focus();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.team-modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });

    // Close modals on overlay click
    document.querySelectorAll('.team-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle-header')?.addEventListener('click', () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('op_theme', newTheme);
    });

    // Table action buttons (edit/delete)
    document.getElementById('team-table-container')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.team-action-btn');
      if (!btn) return;

      const row = btn.closest('tr');
      const id = row?.dataset.id;
      const action = btn.dataset.action;

      if (action === 'edit' && id) {
        this.openUserProfile(id);
      } else if (action === 'delete' && id) {
        this.confirmDelete('user', id);
      }
    });

    // Card clicks (teams, depts, roles)
    document.getElementById('team-table-container')?.addEventListener('click', (e) => {
      const card = e.target.closest('.team-card, .dept-card, .role-card');
      if (!card) return;

      const id = card.dataset.id;
      if (card.classList.contains('team-card')) {
        this.openTeamModal(id);
      } else if (card.classList.contains('dept-card')) {
        this.openDeptModal(id);
      } else if (card.classList.contains('role-card')) {
        this.openRoleModal(id);
      }
    });
  }

  // ============================================
  // Modal Helpers
  // ============================================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  populateInviteForm() {
    const depts = this.storage.getDepartments();
    const roles = this.storage.getRoles();
    const teams = this.storage.getTeams();

    const deptSelect = document.getElementById('invite-department');
    const roleSelect = document.getElementById('invite-role');
    const teamSelect = document.getElementById('invite-team');

    if (deptSelect) {
      deptSelect.innerHTML = depts.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
    }
    if (roleSelect) {
      roleSelect.innerHTML = roles.map(r => `<option value="${r.name.toLowerCase().replace(' ', '-')}">${r.name}</option>`).join('');
    }
    if (teamSelect) {
      teamSelect.innerHTML = teams.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
    }
  }

  sendInvitation() {
    const name = document.getElementById('invite-name')?.value;
    const email = document.getElementById('invite-email')?.value;
    const department = document.getElementById('invite-department')?.value;
    const role = document.getElementById('invite-role')?.value;
    const team = document.getElementById('invite-team')?.value;

    if (!name || !email) {
      alert('Please fill in all required fields');
      return;
    }

    const invites = this.storage.getInvitations();
    invites.unshift({
      id: `inv${Date.now()}`,
      email,
      role: this.capitalize(role),
      department,
      team,
      status: 'pending',
      sentAt: new Date().toISOString()
    });
    this.storage.saveInvitations(invites);

    this.storage.addActivity({
      user: 'You',
      avatar: 'YO',
      color: '#6366f1',
      action: `invited ${name} as ${this.capitalize(role)}`
    });

    document.getElementById('invite-form')?.reset();
    this.closeModal('invite-modal-overlay');
    this.renderPendingInvites();
    this.renderRecentActivity();
  }

  openUserProfile(userId) {
    const users = this.storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('profile-modal');
    const body = document.getElementById('profile-modal-body');
    
    body.innerHTML = `
      <div class="profile-modal-content">
        <div class="profile-modal-header">
          <div class="profile-modal-avatar" style="background: ${user.color}">${user.avatar}</div>
          <div class="profile-modal-info">
            <h4>${user.name}</h4>
            <p>${user.email}</p>
          </div>
        </div>
        <div class="profile-modal-section">
          <h5>Details</h5>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-input form-select" id="profile-dept">
                ${this.storage.getDepartments().map(d => `<option ${d.name === user.department ? 'selected' : ''}>${d.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <select class="form-input form-select" id="profile-role">
                ${this.storage.getRoles().map(r => `<option ${r.name.toLowerCase().replace(' ', '-') === user.role ? 'selected' : ''}>${r.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Team</label>
            <select class="form-input form-select" id="profile-team">
              ${this.storage.getTeams().map(t => `<option ${t.name === user.team ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-input form-select" id="profile-status">
              <option ${user.status === 'online' ? 'selected' : ''}>Online</option>
              <option ${user.status === 'away' ? 'selected' : ''}>Away</option>
              <option ${user.status === 'offline' ? 'selected' : ''}>Offline</option>
            </select>
          </div>
        </div>
      </div>
    `;

    document.getElementById('profile-modal-title').textContent = user.name;
    
    document.getElementById('profile-modal-save').onclick = () => {
      user.department = document.getElementById('profile-dept').value;
      user.role = document.getElementById('profile-role').value.toLowerCase().replace(' ', '-');
      user.team = document.getElementById('profile-team').value;
      user.status = document.getElementById('profile-status').value.toLowerCase();
      this.storage.saveUsers(users);
      this.renderTable();
      this.renderStats();
      this.renderCharts();
      this.closeModal('profile-modal-overlay');
    };

    this.openModal('profile-modal-overlay');
  }

  openTeamModal(teamId) {
    const teams = this.storage.getTeams();
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    document.getElementById('team-modal-title').textContent = team.name;
    document.getElementById('team-modal-body').innerHTML = `
      <div class="form-group">
        <label class="form-label">Team Name</label>
        <input type="text" class="form-input" value="${team.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" rows="3">${team.description}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Team Lead</label>
        <input type="text" class="form-input" value="${team.lead}">
      </div>
    `;
    this.openModal('team-modal-overlay');
  }

  openDeptModal(deptId) {
    const depts = this.storage.getDepartments();
    const dept = depts.find(d => d.id === deptId);
    if (!dept) return;

    document.getElementById('dept-modal-title').textContent = dept.name;
    document.getElementById('dept-modal-body').innerHTML = `
      <div class="form-group">
        <label class="form-label">Department Name</label>
        <input type="text" class="form-input" value="${dept.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Department Lead</label>
        <input type="text" class="form-input" value="${dept.lead}">
      </div>
    `;
    this.openModal('dept-modal-overlay');
  }

  openRoleModal(roleId) {
    const roles = this.storage.getRoles();
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    document.getElementById('role-modal-title').textContent = role.name;
    document.getElementById('role-modal-body').innerHTML = `
      <div class="form-group">
        <label class="form-label">Role Name</label>
        <input type="text" class="form-input" value="${role.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" rows="3">${role.description}</textarea>
      </div>
    `;
    this.openModal('role-modal-overlay');
  }

  confirmDelete(type, id) {
    const modal = document.getElementById('delete-modal-overlay');
    document.getElementById('delete-modal-title').textContent = `Delete ${this.capitalize(type)}`;
    document.getElementById('delete-modal-body').innerHTML = `
      <p style="color: var(--gray-600); font-size: var(--text-sm);">
        Are you sure you want to delete this ${type}? This action cannot be undone.
      </p>
    `;

    document.getElementById('delete-modal-confirm').onclick = () => {
      if (type === 'user') {
        const users = this.storage.getUsers().filter(u => u.id !== id);
        this.storage.saveUsers(users);
        this.renderTable();
        this.renderStats();
        this.renderCharts();
      }
      this.closeModal('delete-modal-overlay');
    };

    this.openModal('delete-modal-overlay');
  }

  // ============================================
  // Utilities
  // ============================================
  timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  }

  capitalize(str) {
    if (!str) return '';
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }
}