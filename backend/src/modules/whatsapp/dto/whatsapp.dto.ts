export interface ConnectWhatsAppRequest {
  organizationId: string;
  sessionKey?: string;
}

export interface ReconnectWhatsAppRequest {
  organizationId: string;
  sessionKey?: string;
}

export interface SendWhatsAppMessageRequest {
  organizationId: string;
  recipient: string;
  content: string;
  messageType?: 'text' | 'image' | 'document';
}
