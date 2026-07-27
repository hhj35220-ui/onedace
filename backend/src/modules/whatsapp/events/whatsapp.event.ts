export interface WhatsAppEventPayload {
  organizationId: string;
  sessionKey: string;
  eventType: string;
  payload: Record<string, unknown>;
}
