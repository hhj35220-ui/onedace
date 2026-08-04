const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const sql = `
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS platform_connections (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "organizationId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "platformType" text NOT NULL DEFAULT 'WHATSAPP',
        status text NOT NULL DEFAULT 'DISCONNECTED',
        "displayName" varchar(255),
        metadata jsonb,
        "lastSeenAt" timestamp with time zone,
        "createdAt" timestamp with time zone DEFAULT now(),
        "updatedAt" timestamp with time zone DEFAULT now(),
        "deletedAt" timestamp with time zone,
        CONSTRAINT fk_platform_connections_organization FOREIGN KEY ("organizationId") REFERENCES organizations(id) ON DELETE CASCADE,
        CONSTRAINT fk_platform_connections_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE RESTRICT
      );

      CREATE INDEX IF NOT EXISTS idx_platform_connections_org ON platform_connections("organizationId");

      CREATE TABLE IF NOT EXISTS whatsapp_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "platformConnectionId" uuid NOT NULL,
        "organizationId" uuid NOT NULL,
        "sessionKey" varchar(255) UNIQUE NOT NULL,
        "phoneNumber" varchar(32),
        "displayName" varchar(255),
        status text NOT NULL DEFAULT 'DISCONNECTED',
        "qrCodeUrl" text,
        "lastConnectedAt" timestamp with time zone,
        "lastSeenAt" timestamp with time zone,
        "lastError" text,
        "createdAt" timestamp with time zone DEFAULT now(),
        "updatedAt" timestamp with time zone DEFAULT now(),
        CONSTRAINT fk_whatsapp_sessions_platform_connection FOREIGN KEY ("platformConnectionId") REFERENCES platform_connections(id) ON DELETE CASCADE,
        CONSTRAINT fk_whatsapp_sessions_organization FOREIGN KEY ("organizationId") REFERENCES organizations(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_org ON whatsapp_sessions("organizationId");

      CREATE TABLE IF NOT EXISTS whatsapp_chats (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "whatsappSessionId" uuid NOT NULL,
        "externalChatId" varchar(255) NOT NULL,
        "chatName" varchar(255),
        "chatType" varchar(50),
        "unreadCount" integer DEFAULT 0,
        archived boolean DEFAULT false,
        "lastMessageAt" timestamp with time zone,
        "createdAt" timestamp with time zone DEFAULT now(),
        "updatedAt" timestamp with time zone DEFAULT now(),
        CONSTRAINT fk_whatsapp_chats_session FOREIGN KEY ("whatsappSessionId") REFERENCES whatsapp_sessions(id) ON DELETE CASCADE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS ux_whatsapp_chats_session_external ON whatsapp_chats("whatsappSessionId", "externalChatId");

      CREATE TABLE IF NOT EXISTS whatsapp_contacts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "whatsappSessionId" uuid NOT NULL,
        "externalContactId" varchar(255) NOT NULL,
        name varchar(255),
        "phoneNumber" varchar(32),
        "profilePictureUrl" text,
        "isBlocked" boolean DEFAULT false,
        "createdAt" timestamp with time zone DEFAULT now(),
        "updatedAt" timestamp with time zone DEFAULT now(),
        CONSTRAINT fk_whatsapp_contacts_session FOREIGN KEY ("whatsappSessionId") REFERENCES whatsapp_sessions(id) ON DELETE CASCADE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS ux_whatsapp_contacts_session_external ON whatsapp_contacts("whatsappSessionId", "externalContactId");

      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "whatsappSessionId" uuid NOT NULL,
        "chatId" uuid,
        "contactId" uuid,
        "externalMessageId" varchar(255),
        direction text,
        "messageType" varchar(50),
        content text,
        status text DEFAULT 'PENDING',
        "sentAt" timestamp with time zone,
        "deliveredAt" timestamp with time zone,
        "readAt" timestamp with time zone,
        "createdAt" timestamp with time zone DEFAULT now(),
        "updatedAt" timestamp with time zone DEFAULT now(),
        CONSTRAINT fk_whatsapp_messages_session FOREIGN KEY ("whatsappSessionId") REFERENCES whatsapp_sessions(id) ON DELETE CASCADE,
        CONSTRAINT fk_whatsapp_messages_chat FOREIGN KEY ("chatId") REFERENCES whatsapp_chats(id) ON DELETE SET NULL,
        CONSTRAINT fk_whatsapp_messages_contact FOREIGN KEY ("contactId") REFERENCES whatsapp_contacts(id) ON DELETE SET NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS ux_whatsapp_messages_session_external ON whatsapp_messages("whatsappSessionId", "externalMessageId");
    `;
    await prisma.$executeRawUnsafe(sql);
    console.log('created whatsapp tables');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
