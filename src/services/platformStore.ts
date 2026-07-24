import { ApplicationRecord, AuditEvent, PlatformUser } from '../types/platform';
import { randomId } from '../core/security';

class PlatformStore {
  private users = new Map<string, PlatformUser>();
  private applications: ApplicationRecord[] = [];
  private auditEvents: AuditEvent[] = [];

  findUserByEmail(email: string): PlatformUser | undefined {
    return [...this.users.values()].find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): PlatformUser | undefined {
    return this.users.get(id);
  }

  createUser(input: Omit<PlatformUser, 'id' | 'createdAt'>): PlatformUser {
    const user: PlatformUser = { ...input, id: randomId('usr'), createdAt: new Date().toISOString() };
    this.users.set(user.id, user);
    return user;
  }

  createApplication(input: Omit<ApplicationRecord, 'id' | 'createdAt' | 'status'>): ApplicationRecord {
    const record: ApplicationRecord = {
      ...input,
      id: randomId('app'),
      createdAt: new Date().toISOString(),
      status: 'received',
    };
    this.applications.unshift(record);
    return record;
  }

  listApplications(): ApplicationRecord[] {
    return [...this.applications];
  }

  addAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const complete: AuditEvent = { ...event, id: randomId('aud'), timestamp: new Date().toISOString() };
    this.auditEvents.unshift(complete);
    this.auditEvents = this.auditEvents.slice(0, 500);
    return complete;
  }

  listAudit(): AuditEvent[] {
    return [...this.auditEvents];
  }

  metrics() {
    return {
      users: this.users.size,
      applications: this.applications.length,
      pendingApplications: this.applications.filter((a) => a.status === 'received' || a.status === 'reviewing').length,
      auditEvents: this.auditEvents.length,
    };
  }
}

export const platformStore = new PlatformStore();
