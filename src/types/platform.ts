export type Role = 'OWNER' | 'ADMIN' | 'DEVTEAM' | 'CREATOR' | 'FILMMAKER' | 'ACTOR' | 'WRITER' | 'PARTNER' | 'USER';

export interface PlatformUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface SessionClaims {
  sub: string;
  email: string;
  role: Role;
  exp: number;
}

export interface ApplicationRecord {
  id: string;
  type: 'actor' | 'filmmaker' | 'creator' | 'writer' | 'musician' | 'podcaster' | 'partner';
  name: string;
  email: string;
  message?: string;
  status: 'received' | 'reviewing' | 'approved' | 'declined';
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  requestId: string;
  actor?: string;
  action: string;
  resource: string;
  outcome: 'success' | 'denied' | 'error';
  timestamp: string;
  metadata?: Record<string, unknown>;
}
