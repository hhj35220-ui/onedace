import { create } from '@wppconnect-team/wppconnect';
import path from 'path';
import fs from 'fs';

const session = `probe-${Date.now()}`;
const tokenDir = path.resolve(process.cwd(), 'wppconnect-tokens');
fs.mkdirSync(tokenDir, { recursive: true });

(async () => {
  const client = await create({
    session,
    headless: true,
    logQR: true,
    autoClose: 0,
    waitForLogin: false,
    disableWelcome: true,
    updatesLog: false,
    folderNameToken: tokenDir,
    puppeteerOptions: { userDataDir: path.resolve(process.cwd(), 'wppconnect-tokens', session) },
    statusFind: (status) => console.log('STATUS', status),
    catchQR: (qr) => console.log('QR', qr.slice(0, 80)),
  });
  console.log('CLIENT_READY', Boolean(client));
  setTimeout(async () => {
    try { await client.close(); } catch {}
    process.exit(0);
  }, 20000);
})().catch((err) => {
  console.error('ERROR', err);
  process.exit(1);
});
