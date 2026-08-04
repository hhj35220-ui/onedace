import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'tmp_db_probe.log');
const append = (line) => fs.appendFileSync(logPath, line + '\n');

async function main() {
  append('starting probe');
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    append('connected');
    const result = await prisma.$queryRawUnsafe(`SELECT current_database(), current_schema(), to_regclass('public.platform_connections') AS pc, to_regclass('public.whatsapp_sessions') AS ws;`);
    append(JSON.stringify(result));
    try {
      const tables = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('platform_connections','whatsapp_sessions','whatsapp_chats','whatsapp_contacts','whatsapp_messages','whatsapp_events','sync_states') ORDER BY table_name;`);
      append(JSON.stringify(tables));
    } catch (e) {
      append('info schema err: ' + e.message);
    }
  } catch (e) {
    append('error: ' + e.message);
    console.error(e);
  } finally {
    await prisma.$disconnect();
    append('done');
  }
}

main().catch((error) => {
  append('fatal: ' + error.message);
  process.exit(1);
});
